const basePath=dirlist.dataSecPath;
const posiDataSec=require(basePath+'position');

//删除职位
module.exports=function(req,res,next){
    if(req.xhr){
        let path=unescape(req.body.path);
        let nowName=req.body.nowName;
        if(!(path && nowName)) 
            return next();

        //修正路径和旧职位
        path=path.split('/');
        let oldName=path.splice(path.length-1,path.length);
        path=path.join('/');

        //修改新职位
        posiDataSec.renamePosition({
             userId:req.session.userId,
             departPath:path,
             oldName:oldName,
             nowName:nowName})
        .then(()=>{
            res.json({
                status:true,
                newPath:escape(path),
                redirectUrl:'/manage/department' 
            }) 
        });
    }else next(); 
}

