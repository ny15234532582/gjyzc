const path=require('path');

const ueditor=require('ueditor');

module.exports=ueditor(dirlist.rootPath+'/public', 
    function(req, res, next) {
        var imgDir = '/img/ueditor/' //默认上传地址为图片
        var ActionType = req.query.action;
        if (ActionType === 'uploadimage' || 
                ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
            //默认上传地址为图片
            var file_url = imgDir;
            /*其他上传格式的地址*/
            if (ActionType === 'uploadfile') {
                //附件保存地址
                file_url = '/file/ueditor/'; 
            }
            if (ActionType === 'uploadvideo') {
                //视频保存地址
                file_url = '/video/ueditor/'; 
            }
            //你只要输入要保存的地址 。保存操作交给ueditor来做
            res.ue_up(file_url); 
            res.setHeader('Content-Type', 'text/html');
        }
        //客户端发起图片列表请求
        else if (ActionType === 'listimage'){
            // 客户端会列出 dir_url 目录下的所有图片
            res.ue_list(imgDir);  
        }
        // 客户端发起其它请求
        else {
            res.setHeader('Content-Type', 'application/json');
            res.redirect('config.json');
        }
    }
);
