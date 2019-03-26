const depaDataSec=require(dirlist.dataSecPath+'department');

module.exports=function(req,res,next){
    if(req.xhr){

        //当前部门路径
        let departPath=unescape(req.body.departPath);

        //添加一个新部门
        depaDataSec.createDepart(
            {userId:req.session.userId,
             departPath:departPath})
        .then(()=>{
            return res.json({
                status:true,
                newPath:escape(departPath),
                redirectUrl:'/manage/department' 
            }); 
        });
    }else next();
}

