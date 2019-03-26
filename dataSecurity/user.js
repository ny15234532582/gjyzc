const userDao=require(dirlist.daoPath+'user');
const userCacheDao=require(dirlist.daoPath+'userCache');
const posiDao=require(dirlist.daoPath+'position');

const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //添加职位
    userAdd:userAdd,
    //获取用户修改页面的相关参数
    userChangeParm:userChangeParm,
    //修改用户启用停止状态
    userChangeDisable:userChangeDisable,
    //删除用户，用户之间用逗号隔开
    deleteUser:deleteUser,
    //通过用户帐号获取用户实体
    userNamefindUser:userNamefindUser,
    //用户分页显示
    userPage:userPage,
    //重置密码
    resetPass:resetPass,
    //检测用户数量
    userNumber:userNumber,
    //检测用户是否为第一次登陆
    checkUserFirstLogin:checkUserFirstLogin,
    //用户登陆
    userLogin:userLogin,
    //系统处于初始状态时创建第一个Admin超级帐号
    createAdmin:createAdmin,
}

async function userAdd(params){
/*添加用户{{{*/
    let data={};
    try{ 
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有权限添加或修改用户['+params.userName+']'});
        //添加用户
        data=await userDao.userAdd(params);

        //成功后的提示信息
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']添加用户['+params.userName+']成功' 
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'添加用户成功',
            roomMsg:'用户['+user.name+
                ']添加或修改用户['+params.userName+
                ']成功，职位:['+params.belongToRole+']' });
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']尝试添加或修改用户失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'添加或修改用户失败'
        });
    }
    return data;
}
/*添加用户}}}*/

async function userChangeParm(params){
/*修改用户界面的相关参数{{{*/
    let allposi='';
    let user={};
    try{
        //权限判断
        await tools.isAdmin({
            userId:params.userId,
            msg:'您没有权限获取此页面'});
        //全部职位
        allposi=await posiDao.positionsTree();
        //查找当前用户
        user=await userDao.userNamefindUser(params.userName);
        //修正当前职位名称
        if(user && user.position){
            position=await posiDao
                .findPosition({_id:user.position._id});
            if(position.length==1){
                user.belongToRole=position[0].department
                    .departPath+'/'+position[0].name;
            }else{
                throw new Error('通过ID['+user.position._id+
                    ']查找职位，出现'+position.length+
                    '个结果');
            }
        }
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
            ']尝试打开用户修改页面时发生错误\n'+err.stack+
            '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'获取用户修改页面失败'
        });
    }
    return {
        user:user,
        allposi:allposi 
    };
}
/*修改用户界面的相关参数}}}*/

async function userChangeDisable(params){
/*修改用户启用停止状态{{{*/
    let data={};
    try{
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有修改用户['+params.userNames+
                ']状态的的权限' });
        params.userName=params.userNames.split(',');
        data=await userDao.changeUserDisable(params);
        //成功后的提示信息
        if(params.enable){
            tools.msg({
                type:'info',
                userId:params.userId,
                msg:'用户['+params.userId+
                ']将用户帐号['+params.userName+
                ']启用成功'
            });
            sockDataSec.sendMsg({
                userId:params.userId,
                msgType:'Find',
                msg:'用户帐号启用成功',
                roomMsg:'用户['+user.name+
                    ']将用户帐号['+params.userName+
                    ']启用成功' });
        }else{
            tools.msg({
                type:'info',
                userId:params.userId,
                msg:'用户['+params.userId+
                ']将用户帐号['+params.userName+
                ']停用成功'
            });
            sockDataSec.sendMsg({
                userId:params.userId,
                msgType:'Find',
                msg:'用户帐号停用成功',
                roomMsg:'用户['+user.name+
                    ']将用户帐号['+params.userName+
                    ']停用成功' });
        }
    }catch(err){
        //失败后的提示信息
        if(params.enable){
            tools.msg({
                type:'error',
                userId:params.userId,
                msg:'用户['+params.userId+
                    ']将用户帐号['+params.userName+
                    ']启用失败\n'+err.stack+
                    '\n参数：\n'+JSON.stringify(params)
            });
            sockDataSec.sendMsg({
                userId:params.userId,
                msgType:'Error',
                msg:'启用帐号失败',
            });
        }else{ 
            tools.msg({
                type:'error',
                userId:params.userId,
                msg:'用户['+params.userId+
                    ']将用户帐号['+params.userName+
                    ']停用失败\n'+err.stack+
                    '\n参数：\n'+JSON.stringify(params)
            });
            sockDataSec.sendMsg({
                userId:params.userId,
                msgType:'Error',
                msg:'停用帐号失败',
            });
        }
    }
    return data;
}
/*修改用户启用停止状态}}}*/

async function deleteUser(params){
/*删除用户，用户之间用逗号隔开{{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有删除用户['+params.users+']的权限' });
        
        //字符串拼接需要删除的正则
        let userNameReg=
            params.users.split(',').join('|');
        userNameReg='^('+userNameReg+'){1}$';

        //删除选中的用户
        data=await userDao
            .userNameRegexDeleteUser(userNameReg);

        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+user.name+
                ']删除用户['+params.users+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'删除用户成功',
            roomMsg:'用户['+user.name+
                ']删除帐号['+params.users+
                ']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']尝试删除用户失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'删除用户失败'
        });
    }
    return data;
}
/*删除用户，用户之间用逗号隔开}}}*/

async function userNamefindUser(params){
/*通过用户帐号获取用户实体{{{*/
    let user={}; 
    try{
        //权限判断
        await tools.isAdmin({
            userId:params.userId,
            msg:'您没有查看用户['+params.userName+
                ']的权限' });
        user=await userDao.userNamefindUser(params.userName);
        let position=await posiDao.findPosition({
            _id:user.position._id, });
        user.departPath=position[0].department.departPath;
        //成功后的消息记录
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']通过帐号['+params.userName+
                ']获取用户信息'
        });
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'通过帐号['+params.userName+
                ']获取用户信息失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'获取用户信息失败'
        });
    }
    return user;
}
/*通过用户帐号获取用户实体}}}*/

async function userPage(params={ onepageNum:10,
/*用户分页{{{*/
    nowNum:1, where:{} }){
    //初始化数据
    let users=[];
    let userNum=0;
    try{
        //权限判断
        await tools.isAdmin({
            userId:params.userId,
            msg:'您没有权限获取用户分页数据' });

        //跳过的数据
        let skipNum=(params.nowNum-1)*params.onepageNum;

        //从数据库中获取用户分页数据
        users=await userDao.whereFindUserPage({
            where:params.where,
            skipNum:skipNum,
            onepageNum:params.onepageNum });

        //用户总数
        userNum=(await userDao.allUserNumber(
            params.where)).length;

    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId, 
            msg:'获取用户分页数据时发生错误\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'获取用户分页数据时发生错误'
        });
    }

    return {
        users:users,
        userNum:userNum 
    };
}
/*用户分页}}}*/

async function resetPass(params){
/*重置用户密码，用户之间用逗号隔开{{{*/
    let data={};
    try{
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有重置用户['+params.userNames+']的权限' });
        let userNameReg=
            params.userNames.split(',').join('|');
        userNameReg='^('+userNameReg+'){1}$';

        //重置选中的用户
        data=await userDao.userNameRegexResetPass(userNameReg);
        
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId, 
            msg:'用户['+params.userId+
                ']重置帐号['+params.userNames+
                ']的用户密码成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'重置用户密码成功',
            roomMsg:'用户['+user.name+
                ']重置帐号['+params.userNames+
                ']的用户密码成功'
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']尝试重置帐号['+params.userNames+
                ']的用户密码失败'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'重置用户密码失败'
        });
    }
    return data;
}
/*重置用户密码，用户之间用逗号隔开}}}*/

async function userNumber(params){
/*返回用户的总数{{{*/
    let allNum=(await userDao.allUserNumber(params)).length;
    return allNum;
}
/*返回用户的总数}}}*/

async function checkUserFirstLogin(userName){
/*检测用户是否为第一次登陆{{{*/
    let user=null;
    try{
        user=await userDao.userNamefindUserPass(userName);
    }catch(err){
        tools.msg({
            type:'error',
            msg:'检测用户['+userName+
            ']是否为第一次登陆失败\n'+err.stack+
            '\n参数：\n'+JSON.stringify(params)
        });
        throw new Error('检测用户['+userName+
            ']是否为第一次登陆失败');
    }
    if(user && !user.userPassword && user.enable)
        return true;
    else
        return false;
}
/*检测用户是否为第一次登陆}}}*/

async function userLogin(params){
/*用户登陆{{{*/
    let status=null;
    try{
        //检测密码是否正确
        statusVar=await checkUserPass({ 
            userName:params.userName,
            password:params.password });

        //根据验证结果决定是否继续执行
        status=statusVar;
        if(!status.stat) return status;
        
        //登陆后的初始化 
        await loginInit({
            req:params.req,
            user:status.user });

        //成功后的消息记录
        tools.msg({
            type:'info',
            msg:'用户['+params.userName+']登陆成功'
        });
    }catch(err){

        //失败后的消息记录
        tools.msg({
            type:'error',
            msg:'用户['+params.userName+
                ']登陆失败'+err.stack
        });
        throw err;
    }

    return status;
}
/*用户登陆}}}*/

async function checkUserPass(params){
/*检测密码是否合法{{{*/

    //帐号密码为空
    if(params.userName.length<=0 || 
        params.password.length<=0)
            return { stat:false,
                msg:'帐号密码不可为空' };

    let userOne=await userDao
        .userNamefindUser(params.userName)

    //帐号是否存在和启用
    if(!(userOne && userOne.enable)) 
        return { stat:false,
            msg:'未查找到当前用户' };

    //检测密码是否存在
    if(!userOne.userPassword){
        await userDao.changeUserPass({
            userId:userOne._id,
            password:params.password });
        tools.msg({
            type:'info',
            msg:'用户['+userOne._id+
                ']首次登陆系统，已初始化密码为['+
                params.password+']'
        });
    }else if(userOne.userPassword!==params.password){
        return { stat:false,
            msg:'密码错误' };
    }
    tools.msg({
        type:'info',
        msg:'用户['+userOne._id+'已成功登陆系统'    
    });
    return { stat:true,
        user:userOne };
}
/*检测密码是否合法}}}*/

async function loginInit(params){
/*用户登陆后的初始化{{{*/
    let req=params.req;
    let user=params.user;
    let sess=params.req.session;

    //将当前用户存入缓存中
    await userCacheDao.saveKeyToCache({
        userId:user._id,
        key:'Info',
        val:JSON.stringify(user)
    });

    //将sessId存储到用户缓存中
    await userCacheDao.saveKeyToCache({
        userId:user._id,
        key:'sessId',
        val:configs.sessPrefix+':'+
            req.sessionID
    });

    //将用户ID存储到session中
    sess.userId=user._id;

}
/*用户登陆后的初始化}}}*/

async function createAdmin(){
/*系统处于初始状态时创建第一个Admin超级帐号{{{*/
    let isInit=false;
    try{
        //检测是否存在admin账户
        let userAdmin=await userDao
            .allUserNumber({userName:'admin'});
        //系统存在Admin帐号
        if(userAdmin.length>0) return false;

        //添加用户
        data=await userDao.userAdd({
            userName:'admin', name:'', phone:'', Email:'',
            address:'', qq:'', weixin:'', enable:true });
        isInit=true;

        //成功后的提示信息
        tools.msg({
            type:'info',
            msg:'系统初始化Admin账户成功'
        });
    }catch(err){
        isInit=false;
        //失败后的提示信息
        tools.msg({
            type:'error',
            msg:'系统初始化Admin账户时发生意外\n'+err.stack
        });
    }
    return isInit;
}
/*系统处于初始状态时创建第一个Admin超级帐号}}}*/

