const artFolderDataSec=require('../../dataSecurity/artfolder');

// 根据req.session.nowfolder显示特定文件夹列表
module.exports=function(req,res,next){
    if(req.xhr){

        //从数据库根据路径显示目录
        clientParams(req)
        .then((params)=>{
            return res.render('folderShow', params); 
        });
    }else next(); 
}

async function clientParams(req){
/*需要传给客户端的数据{{{*/
    let params={};
    //如果指定了当前目录，则返回当前目录
    if(req.query.path){
        req.session.showPath=
            params.showPath=unescape(req.query.path);
    //如果指定了追加目录，则在当前目录基础上追加
    }else if(req.query.appendPath && req.session.showPath){
        req.session.showPath=
            params.showPath=
                req.session.showPath+'/'+
                unescape(req.query.appendPath);
    //如果没有当前目录，则返回根目录
    }else if(!req.session.showPath){
        req.session.showPath=
            params.showPath='栏目分类';
    }

    //获取当前目录对象
    let artfolderOne=await artFolderDataSec
        .pathFindArtFolder({
            path:req.session.showPath,
            userId:req.session.userId });
    //文件夹
    params.lowFolders=[];
    artfolderOne.lowFolders && 
        artfolderOne.lowFolders.forEach((item)=>{
        params.lowFolders.push(
            item.path.slice(
            item.path.lastIndexOf('/')+1));
    }); 
    //文件
    params.artfiles=[];
    artfolderOne.artfiles && 
        artfolderOne.artfiles.forEach((item)=>{
        params.artfiles.push(item.title);
    });
    //面包屑
    params.folderPath=req.session.showPath.split('/');
    //页面固定的数据
    pageBaseData(params);
    return params;
}
/*需要传给客户端的数据}}}*/

function pageBaseData(params){
/*页面固定的数据{{{*/
    //不使用布局文件
    params.layout=null;
    //右键菜单1
    params.rightMenus1=
        ['新建文章','新建栏目','全选','属性'];
    //右键菜单2
    params.rightMenus2=
        ['打开','重命名','删除','属性'];
    //客户端动作列表
    params.cliAction='lmflAction';
}
/*页面固定的数据}}}*/

