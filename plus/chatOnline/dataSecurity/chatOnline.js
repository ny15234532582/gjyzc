const daoChatOn=require('../dao/chatOnline');
const sockDao=require(dirlist.daoPath+'socket');
const userDao=require(dirlist.daoPath+'user');
const userCacheDao=require(dirlist.daoPath+'userCache');
const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //获取所有用户列表
    allUser:allUser,
    //转发客户端之间的信息
    forwardMsg:forwardMsg,
    //根据userid获取所有聊天记录
    uidMsg:uidMsg,
    //获取所有的用户
    allUser:allUser,
}

async function allUser(params){
/*获取所有用户列表{{{*/
    //结果 
    let aot=[];
    try{
        //获取所有的用户列表
        let users=await daoChatOn.allUser();
        //遍历并整理用户数据
        for(let i=0;i<users.length;i++){
            let item=users[i];
            let userId=item.slice('user:'.length);
            //如果是当前用户，则跳过
            if(params.userId===userId){
                continue;
            }
            //用户信息
            let userInfo=JSON.parse(await userCacheDao
                .getValFromCache({
                userId:userId,
                key:'Info'
            }));
            //用户是否退出系统
            let userlogout=JSON.parse(await userCacheDao
                .getValFromCache({
                userId:userId,
                key:'logout'
            }));
            //将结果添加到结果集中
            aot.push({
                name:userInfo.name,
                logout:userlogout,
                userId:userInfo._id
            });
        }
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']获取所有用户信息失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'获取所有用户信息失败'
        });
    }
    //返回结果
    return aot;
}
/*获取所有用户列表}}}*/

async function forwardMsg(params){
/*转发客户端之间的信息{{{*/
    let data;
    let myUser;
    let othUser;
    try{
        //获取自己的socket实体
        let mySock=tools.socketio
            .of('/default').to(params.nowsid);
        //通过userName与userposi获取相应的用户
        myUser=await userDao.findUser({
            name:params.userName });
        if(myUser.length>1){
            myUser.forEach((item)=>{
                if(item.position.name==params.userPosi){
                    myUser=item;         
                }
            });
        }else myUser=myUser[0];
        //获取对方的socket实体与User信息
        let othsid=await userCacheDao.getValFromCache({
            userId:params.userId,
            key:'socketId' });
        let othSock=tools.socketio.of('/default').to(othsid);
        othUser=JSON.parse(await 
            userCacheDao.getValFromCache({
            userId:params.userId,
            key:'Info' 
        }));
        //保存到redis中
        daoChatOn.saveMsgToRedis({
            form:myUser._id,
            to:params.userId,
            msg:params.msg
        });
        data={
            nowInfo:{
                user:myUser,
                sock:mySock,
            },
            otherInfo:{
                user:othUser,
                sock:othSock,
            }
        };
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:myUser._id,
            msg:'用户['+myUser._id+
                ']发送信息到['+othUser._id+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:myUser._id,
            msgType:'Error',
            msg:'发送信息失败'
        });
    }
    return data;
}
/*转发客户端之间的信息}}}*/

async function uidMsg(params){
/*根据userid获取所有聊天记录{{{*/
    let formatMsg=[];
    try{
        //获取消息的key
        let msgKey=await userCacheDao.getValFromCache({
            userId:params.userId,
            key:'chatOnline:'+params.otherUserId
        });
        //获取消息的列表
        let allMsg=await daoChatOn.getMsgFromRedis(msgKey);
        //将消息中的userId转为姓名
        for(let i=0;i<allMsg.length;i++){
            let item=JSON.parse(allMsg[i]);
            let othuser=JSON.parse(
                await userCacheDao.getValFromCache({
                userId:item.form,
                key:'Info',
            }));
            formatMsg.push({
                userName:othuser.name,
                msg:item.msg,
                isMy:othuser._id==params.userId
            });
        }
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'查找用户['+params.userId+
                ']的聊天记录失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'查找当前聊天记录失败'
        });
    }
    return formatMsg;
}
/*根据userid获取所有聊天记录}}}*/

