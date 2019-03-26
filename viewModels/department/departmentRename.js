const depDataSec=require(dirlist.dataSecPath+'department');

//重命名部门
module.exports=function(req,res,next){
    if(req.xhr){
        //初始化
        let departmentpath=unescape(req.body.path);
        let nowName=req.body.nowName;

        if (!(departmentpath && nowName)) return next();

        //替换
        depDataSec.renameDepartName({
            userId:req.session.userId,
            departPath:departmentpath,
            newPath:nowName})
        .then(()=>{
            //跳转到当前页面
            var departPathAry=departmentpath.split('/');
            var nowPath=departPathAry
                .slice(0,departPathAry.length-1);
            nowPath=nowPath.join('/');
            res.json({ 
                status:true, 
                newPath:nowPath,
                redirectUrl:'/manage/department' 
            }); 
        });
    }else next();
}
