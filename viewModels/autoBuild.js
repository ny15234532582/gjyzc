const crypto = require('crypto');

module.exports=function(req,res,next){
    
    let hmac = crypto.createHmac('sha1',configs.hooksSecret);

    let jsonBody=JSON.stringify(req.body);
    hmac.update(Buffer.alloc(jsonBody.length,jsonBody));
    let signature = 'sha1=' + hmac.digest('hex');

    let _signature = req.headers['x-hub-signature'];

    if(_signature != signature){
        tools.msg({
            type:'error',
            msg:'github webhooks匹配失败',
        });
        return res.end()
    }
    tools.run_cmd('sh',[dirlist.binPath+'autoBuild.js',dirlist.rootPath]);

    res.json({status:'ok'});
    res.end();
};
