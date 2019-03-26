const cookie=require('cookie');
const signature=require('cookie-signature')
const socketDao=require(dirlist.daoPath+'socket');
const userCacheDao=require(dirlist.daoPath+'userCache');

module.exports={
    //向客户端发送信息
    sendMsg:sendMsg,
    //socket，connect连接初始化
    socket_conn:socket_conn,
    //socket退出系统
    socket_disconn:socket_disconn,
    //用户退出登陆
    userLogout:userLogout,
}

/* 
 * 参数：
 * userId:用户ID
 * msgType:消息类型，暂时有Info和Error，Find(最终项目，会提示给所有的人员)
 * msg:给当前用户看的消息提示
 * roomMsg:给房间内其他用户看的消息提示
 *
 */
async function sendMsg(params){
/*向客户端发送提示信息{{{*/
    try{
        if(params.msgType=='Info') return; 

        let socketId=await userCacheDao.getValFromCache({
            userId:params.userId,
            key:'socketId'});
        let socket=tools.socketio
            .nsps['/default'].sockets[socketId];
        //如果为最终消息，则向所有人广播
        if(params.msgType=='Find'){
            //修正提示类型
            params.msgType='Info';

            socket.broadcast.emit('serverMessage',
                {msgType:params.msgType,
                 msg:params.roomMsg});
        }

        socket.emit('serverMessage', {
            msgType:params.msgType,
            msg:params.msg
        });

    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg: '在向客户端发送信息时，'+
                '使用userId['+params.userId+
                ']获取session失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
    }
    return;
}
/*向客户端发送提示信息}}}*/

async function socket_conn(socket){
/*socket，connect连接初始化{{{*/
    let user;
    let oldSocketId;
    try{
        //获取当前用户
        let sessionID=getConnectSid(socket);
        let sess=await socketDao.sid_get_sess(sessionID);

        user=JSON.parse(await userCacheDao.getValFromCache({
            userId:sess.userId,
            key:'Info'}));

        //在线的当前用户socketId
        oldSocketId=await userCacheDao
            .getValFromCache({
            userId:sess.userId, 
            key:'socketId' });
        //将新的socketId存储到redis用户缓存中
        await userCacheDao.saveKeyToCache({
            userId:sess.userId,
            key:'socketId',
            val:socket.id });
        //将退出信息从redis用户缓存中删除
        await userCacheDao.saveKeyToCache({
            userId:sess.userId,
            key:'logout',
            val:false });
        //消息提示
        tools.msg({
            type:'info',
            userId:user._id,
            msg:'用户['+user.name+
                ']登陆系统' 
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'在与用户['+params.userId+
                ']建立socket连接后，初始化失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
    }

    return { 
        user:user,
        oldSocketId:oldSocketId 
    };
}
/*socket，connect连接初始化}}}*/

async function socket_disconn(socket){
/*socket退出系统{{{*/
    let user=null;
    try{
        let sess={};
        //手动退出系统
        if(socket.disConnMark){
            user={
                _id:socket.disUserId,
                name:socket.disUserName,
                nowposi:socket.disUserPosi 
            };
        }else{
        //系统检测离线
            let sessionID=getConnectSid(socket);
            sess=await socketDao.sid_get_sess(sessionID);
            user=JSON.parse(await userCacheDao
                .getValFromCache({
                userId:sess.userId,
                key:'Info' }));
            //职位的便捷方式，为了与手动退出系统取值方式一样
            user.nowposi=user.position && user.position.name || '';
        }
        //将退出信息添加到redis用户缓存中
        await userCacheDao.saveKeyToCache({
            userId:user._id,
            key:'logout',
            val:true 
        });
        //消息记录
        tools.msg({
            type:'info',
            userId:user._id,
            msg:'用户['+user.name+
                ']，职位['+user.nowposi+
                ']退出系统'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:user._id,
            msg:']用户['+user._id+
                ']退出系统后，将消息存入用户缓存中失败\n'+err.stack
        });
    }
    return user;
}
/*socket退出系统}}}*/

async function userLogout(params){
/*用户退出登陆{{{*/
    let user=null;
    try{
        let socketId=await userCacheDao.getValFromCache({
            userId:params.userId,
            key:'socketId' });

        user=JSON.parse(await userCacheDao.getValFromCache({
            userId:params.userId,
            key:'Info' }));
        user=JSON.parse(user);

        //将socket从全局删除
        delete tools.uidsocks[socketId];

        let socket=tools.socketio
            .nsps['/default'].sockets[socketId];

        //标记socket为退出状态
        socket.disConnMark=true;
        socket.disUserId=user._id,
        socket.disUserName=user.name;
        socket.disUserPosi=user.position.name;

        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']退出系统成功' 
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg: '用户['+params.userId+
                ']退出系统失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
    }
    return user;
}
/*用户退出登陆}}}*/

function getConnectSid(socket){
/*通过cookie获取sessionId {{{*/
    let head=socket.handshake.headers.cookie;
    //解析cookie
    let cookies = cookie.parse(head);
    //cookie密钥
    let secrets=[];
    secrets.push(configs.cookieSecret);
    let raw=cookies['connect.sid'];
    let val;

    if(raw && (raw.substr(0, 2) === 's:')){
        val = unsigncookie(raw.slice(2), secrets);

        if (val === false) {
            val = undefined;
        }
    } 
    return 'sess:'+val;
}
/*通过cookie获取sessionId值 }}}*/
function unsigncookie(val, secrets) {
/*验证并解码`val` with `secrets`.{{{ */
    for (var i = 0; i < secrets.length; i++) {
        var result = signature.unsign(val, secrets[i]);

        if (result !== false) {
            return result;
        }
    }
    return false;
}
/*验证并解码`val` with `secrets`.}}} */

