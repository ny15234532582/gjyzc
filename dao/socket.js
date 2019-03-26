module.exports={
    //通过sessionId获取session
    sid_get_sess:sid_get_sess,
    //所有session
    all_sess:all_sess,
}


function sid_get_sess(sid){
/*通过sessionId获取user{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.get(sid,(err,session)=>{
            if(err) return reject(err);
            if(!session) return resolve(null);

            session=JSON.parse(session);
            resolve(session);
        });
    });
}
/*通过sessionId获取user}}}*/

function all_sess(){
/*获取当前所有session{{{*/
    return new Promise((resolve,reject)=>{
        tools.redisCli.keys(configs.sessPrefix+':*',
            (err,keys)=>{
            if(err) return reject(err);
            resolve(keys);
        });
    });
}
/*获取当前所有session}}}*/

