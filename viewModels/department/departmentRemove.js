const depaDataSec=require(dirlist.dataSecPath+'department');

//删除部门
module.exports=function(req,res,next){
    if(req.xhr){
        let departPath=unescape(req.body.departPath);
        let departName=unescape(req.body.departName);

        depaDataSec.deleteDepartments({
            userId:req.session.userId,
            departPath:departPath+'/'+departName })
        .then(()=>{
            res.json({
                status:true,
                newPath:req.body.departPath,
                redirectUrl:'/manage/department' 
            });
        });

    }else next(); 
}
