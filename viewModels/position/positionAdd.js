const basePath=dirlist.dataSecPath;
const posiDataSec=require(basePath+'position');

//添加职位
module.exports=function(req,res,next){
    if(req.xhr){
        var path=unescape(req.body.departPath);
        if(!path) return next();
        
        posiDataSec.addNewPosition({
            departPath:path,
            userId:req.session.userId})
        .then(()=>{
            res.json({
                status:true,
                newPath:req.body.departPath,
                redirectUrl:'/manage/department' 
            }); 
        });
    }else next(); 
}

