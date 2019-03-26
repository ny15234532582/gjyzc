const artFolderDataSec=require('../../dataSecurity/artfolder');

//添加栏目
module.exports=function(req,res,next){
    if(req.xhr){
        //创建子栏目
        artFolderDataSec.createArtFolder(
            {path:req.session.showPath,
             userId:req.session.userId })
        .then((data)=>{
            res.json({ status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' 
            }); 
        }); 
    }else next(); 
}

