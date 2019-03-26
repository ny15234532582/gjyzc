const artFolderDataSec=require('../../dataSecurity/artfolder');

//删除目录
module.exports=function(req,res,next){
    if(req.xhr){
        let filename=req.body.filename;
        if(!filename) return next();
        let removepath=req.session.showPath+'/'+filename;
        //删除目录
        artFolderDataSec.removeArtFolder({
            path:removepath,
            userId:req.session.userId })
        //刷新当前页
        .then(()=>{
            return res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' 
            }); 
        });

    }else{ next(); };
}

