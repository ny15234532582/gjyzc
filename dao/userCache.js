module.exports={
    //根据字段获取redis用户缓存
    getValFromCache:getValFromCache,
    //保存字段到redis用户缓存中
    saveKeyToCache:saveKeyToCache,
}

function getValFromCache(params){
/*获取用户缓存中的字段{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.hget('user:'+params.userId,
            params.key,function(err,res){
            if(err) return reject(err);
            return resolve(res);
        });
    });
}
/*获取用户缓存中的字段}}}*/

function saveKeyToCache(params){
/*添加字段到用户缓存中{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.hset('user:'+params.userId,
            params.key,params.val,function(err,res){
            if(err) return reject(err);
            return resolve(res);
        });
    });
}
/*添加字段到用户缓存中}}}*/

