const artFolDataSec=require('../../dataSecurity/artfolder');

module.exports=function(req,res,next){
    if(req.xhr){
        //当前栏目
        let nowfolder=req.body.nowfolder;
        //职位名称
        let posiName=req.body.posiName;
        posiName=posiName.slice(posiName.lastIndexOf('/')+1);
        //当前职位对应的栏目权限
        let auth=req.body.auth;

        artFolDataSec.changePosiAuth({
            showpath:req.session.showPath+'/'+nowfolder,
            userId:req.session.userId,
            posiName:posiName,
            posiAuth:auth})
        .then(()=>{
            return res.json({
                status:true,
                auth:auth 
            }); 
        }); 
    }else next();
}

