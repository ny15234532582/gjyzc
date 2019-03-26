const artfileDataSec=require('../../dataSecurity/artfile');

//文章重命名
module.exports=function(req,res,next){
    if(req.xhr){
        let nowFileName=req.body.nowName;
        let oldFileName=req.body.filename;
        artfileDataSec.renameArtFile({ 
            userId:req.session.userId,
            path:req.session.showPath,
            fileName:oldFileName,
            newName:nowFileName})
        .then(()=>{
            return res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' 
            }); 
        });
    }else next();
}

