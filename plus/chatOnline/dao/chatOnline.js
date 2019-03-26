const uuid=require('uuid');
const userCacheDao=require(dirlist.daoPath+'userCache');

module.exports={
    //获取所有的用户
    allUser:allUser,
    //在缓存中通过key获取value
    redGet:redGet,
    //将消息保存到redis中
    saveMsgToRedis:saveMsgToRedis,
    //通过userId获取消息
    getMsgFromRedis:getMsgFromRedis
}

function allUser(){
/*获取所有的用户{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.keys('user:*',
            (err,res)=>{
            if(err) return reject(err);
            resolve(res);
        });
    });
}
/*获取所有的用户}}}*/

async function saveMsgToRedis(params){
/*将消息保存到redis中{{{*/
    try{
        let chatListKey=await userCacheDao
            .getValFromCache({
            userId:params.form,
            key:'chatOnline:'+params.to
        });
        //消息Key
        let uuidNum;
        if(!chatListKey){
            uuidNum=uuid.v1();
            //将消息Key保存到双方用户缓存中
            await userCacheDao.saveKeyToCache({
                userId:params.form,
                key:'chatOnline:'+params.to,
                val:uuidNum
            });
            await userCacheDao.saveKeyToCache({
                userId:params.to,
                key:'chatOnline:'+params.form,
                val:uuidNum
            });
        }else{
            uuidNum=chatListKey;
        }
        //将消息保存至缓存中
        tools.redisCli.rpush(uuidNum,
            JSON.stringify(params));
    }catch(err){
        console.log(err.stack);
    }
    return ;
}
/*将消息保存到redis中}}}*/

function redGet(key){
/*在缓存中通过key获取value{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.get(key,(err,data)=>{
            if(err) return reject(err);
            resolve(JSON.parse(data));
        });
    });
}
/*在缓存中通过key获取value}}}*/

function getMsgFromRedis(key){
/*通过userId获取消息{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.lrange(key,0,-1,(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        });
    });
}
//通过userId获取消息}}}*/

