const crypto = require('crypto');

module.exports=function(req,res,next){
    autoBuildFun() 
    .then(()=>{
        tools.msg({
            type:'info',
            msg:'github webhooks同步成功',
        });
        res.json({status:'ok'});
        res.end();
    },(err)=>{
        tools.msg({
            type:'error',
            msg:'github webhooks匹配失败\n'+err.stack,
        });
        next();
    });
};

async function autoBuildFun(req){
/*同步代码{{{*/
    let hmac = crypto.createHmac('sha1',configs.hooksSecret);

    let jsonBody=JSON.stringify(req.body);
    hmac.update(Buffer.alloc(jsonBody.length,jsonBody));
    let signature = 'sha1=' + hmac.digest('hex');

    let _signature = req.headers['x-hub-signature'];

    if(_signature != signature){
        throw new Error('同步失败，因为没有匹配成功\n'+
            signature+'\n'+_signature);
    }
    //同步代码
    require('child_process').execFileSync(dirlist.binPath+'autoBuild.sh',[dirlist.rootPath]);
}
/*同步代码}}}*/
