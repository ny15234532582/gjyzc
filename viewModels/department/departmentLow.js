const depaDataSec=require(dirlist.dataSecPath+'department');

//查找子部落字符串
module.exports=function(req,res,next){

    if(req.xhr){
        let respath=req.query.path.split('/').slice(1).join('/');

        depaDataSec.findLowDepartments({
            userId:req.session.userId,
            departPath:respath })
        .then((lowDepartAry)=>{
            res.json({lowFolder:lowDepartAry});
        });
        
    }else next();

}
