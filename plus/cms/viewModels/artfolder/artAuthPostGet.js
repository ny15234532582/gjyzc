const artFolDataSec=require('../../dataSecurity/artfolder');

//获取权限返还给客户端
module.exports=function(req,res,next){
    if(req.xhr){
        let posiName=req.query.posiName;
        let nowfolder=req.query.nowfolder;
        if(!posiName) return next();
        //获取权限
        artFolDataSec.artFolProperty({
            parFolPath:req.session.showPath,
            artfol:nowfolder,
            posiName:posiName
        }).then((auth)=>{
            return res.json({
                status:true,
                auth:auth 
            }); 
        });
    }else next();
}

