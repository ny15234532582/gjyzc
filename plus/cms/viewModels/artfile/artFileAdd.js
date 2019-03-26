const artfileDataSec=require('../../dataSecurity/artfile');

// 添加文章 
module.exports=function(req,res,next){
    if(req.xhr){
        //创建文章
        artfileDataSec.createArtFile({
                path:req.session.showPath,
                posi:req.session.detailPosi,
                userId:req.session.userId})
        .then(()=>{
            //向客户端返回数据
            res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' }); 
        },(err)=>{
            res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' }); 
        });
    }else next();
}

