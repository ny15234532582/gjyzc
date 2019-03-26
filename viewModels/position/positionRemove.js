const basePath=dirlist.dataSecPath;
const posiDataSec=require(basePath+'position');

//删除职位
module.exports=function(req,res,next){
    if(req.xhr){
        let departPath=unescape(req.body.departPath);
        let positionName=req.body.positionName;

        if(!(departPath && positionName)) 
            return next();

        posiDataSec.removePosition(
            {userId:req.session.userId,
             departPath:departPath,
             positionName:positionName})
        .then(()=>{
            res.json({ status:true,
                newPath:req.body.departPath,
                redirectUrl:'/manage/department' 
            }) 
        });
    }else next(); 
}

