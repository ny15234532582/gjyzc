const logDao=require(dirlist.daoPath+'log');
const userCacheDao=require(dirlist.daoPath+'userCache');

module.exports={
    //添加日志
    addLog:addLog,
    //查询系统操作日志
    findSystemInfo:findSystemInfo,
}

async function addLog(params){
/*添加日志{{{*/
    let data=null;
    try{
        //将日志添加到缓存中
        let logKey=await logDao.addLog(params);
        //将日志在缓存中与用户进行关联
        data=await userCacheDao.saveKeyToCache({
            userId:params.userId,
            key:'log:'+params.type,
            val:logKey });
    }catch(err){
        //失败后的信息记录
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'将用户['+params.userId+
                ']的日志存储到缓存中失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
    }
    return data;
}
/*添加日志}}}*/

async function findSystemInfo(params){
/*查询系统操作日志{{{*/
    let logLists=[];
    let allNum=0;
    try{
        //日志列表
        logLists=await logDao.findLog(params);
        //日志数量
        allNum=await logDao.logNum(params);
    }catch(err){
        //失败后的信息记录
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'从缓存中获取用户['+params.userId+
                ']的相关日志出错\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
    }
    return {
        logLists:logLists,
        allNum:allNum
    };
}
/*查询系统操作日志}}}*/

