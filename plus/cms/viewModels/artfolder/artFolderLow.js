const artFolderDataSec=require('../../dataSecurity/artfolder');

//获取下层目录用于左侧树状菜单
module.exports=function(req,res,next){
    if(req.xhr){
        artFolderDataSec.pathFindArtFolder(
            {path:req.query.path,
            userId:req.session.userId})
        .then((artfolOne)=>{
            //如果返回当前目录，则没有权限
            if(artfolOne){
                let lowfolder=[];
                artfolOne.lowFolders.forEach((item)=>{
                    lowfolder.push(
                        item.path.slice(
                        item.path.lastIndexOf('/')+1));
                });
                return res.json({
                    lowFolder:lowfolder
                });
            }else{ 
                res.json({});
            }
        });
    }else next();
}
