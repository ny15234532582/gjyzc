module.exports={
    //添加日志
    addLog:addLog,

    //日志数量
    logNum:logNum,

    //查找日志
    findLog:findLog,
}

function addLog(params){
/*创建日志{{{*/
    return new Promise((resolve,reject)=>{
        //日志的键
        let key='log:'+params.type+':'+params.userId;
        //添加日志到缓存中
        tools.redisCli.rpush(
            key,params.msg,(err,res)=>{
            if(err) return reject(err);
            //设置生命周期,默认为一周
            setttllog({ 
                type:params.type,
                userId:params.userId,
                ttl:(configs.loginOfTime 
                    && configs.loginOfTime/1000) 
                    || 60*60*24*7 })
            .then(()=>{
                return resolve(key);
            })
        });
    });
}
/*添加日志}}}*/

function findLog(params){
/*查询日志{{{*/
    //日志的键
    let key='log:'+params.type+':'+params.userId;
    return new Promise((resolve,reject)=>{
        //获取日志
        tools.redisCli.lrange(key,
            params.start,params.end,
            (err,lists)=>{
                if(err) return reject(err);
                resolve(lists);
            }
        )
    });
}
/*查询日志}}}*/

function logNum(params){
/*获取日志的数量{{{*/
    //日志的键
    let key='log:'+params.type+':'+params.userId;
    return new Promise((resolve,reject)=>{
        //获取数量
        tools.redisCli.llen(key,(err,len)=>{
            if(err) return reject(err);
            resolve(len);
        });
    });
}
/*获取日志的数量}}}*/

function setttllog(params){
/*设置日志的生命周期{{{*/
    return new Promise((resolve,reject)=>{
        logNum(params)
        .then((len)=>{
            //设置生命周期
            if(len==1){
                tools.redisCli.expire(
                    'log:'+params.type+':'+params.userId,
                    params.ttl,(err1,res1)=>{
                    if(err1) return reject(err1);
                    return resolve();
                });
            }else return resolve();

        },(err)=>{
            reject(err);
        });
    });
}
/*设置日志的生命周期}}}*/

