const webInfoDataSec=require('../dataSecurity/webinfo');

module.exports=function(req,res,next){

    webInfoDataSec.posiWebInfo(req)
    .then((webinfoOne)=>{
        //延时跳转到管理端首页
        setTimeout(()=>{
            res.redirect(303,'/manage/admin');  
        },2000);
    });

}

