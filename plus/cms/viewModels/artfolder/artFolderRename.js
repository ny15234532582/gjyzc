const artFolderDataSec=require('../../dataSecurity/artfolder');

//目录重命名
module.exports=function(req,res,next){
    if(req.xhr){
        let nowFileName=req.body.nowName;
        let oldFileName=req.body.filename;
        
        //修改的路径
        artFolderDataSec.renameArtFolderName({
            userId:req.session.userId,
            path:req.session.showPath,
            oldName:oldFileName,
            newName:nowFileName })
        .then(()=>{ 
            return res.json({ status:true,
                newPath:req.session.showPath,
                redirectUrl:'/manage/artfolder' }); 
        },(err)=>{
            return res.json({ status:false}); 
        });
    }else{ next(); }
}

