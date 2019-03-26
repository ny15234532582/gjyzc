const artfileDataSec=require('../../dataSecurity/artfile');

module.exports=function(req,res,next){
    if(req.xhr){
        let filename=req.body.filename;
        //删除文章
        artfileDataSec.removeArticle({ 
            userId:req.session.userId,
            path:req.session.showPath,
            filename:req.body.filename})
        .then(()=>{
            return res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' }); });

    }else{ next(); };
}

