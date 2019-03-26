const webInfoDataSec=require('../dataSecurity/webinfo');

module.exports=function(req,res,next){
    webInfoDataSec.getWebInfo({
        userId:req.session.userId }) 
    .then((webinfoOne)=>{
        let pageParams={};
        if(webinfoOne){
            pageParams=setPageParams(webinfoOne);
        }
        return res.render('plus/webinfo/webinfo',pageParams);
    },(err)=>{
        next(err);
    });
}

function setPageParams(webinfoOne){
/*设置页面参数{{{*/
    return { layout:null, 
        webName:webinfoOne.webName, 
        logo:webinfoOne.logo, 
        companyName:webinfoOne.companyName, 
        address:webinfoOne.address, 
        phone:webinfoOne.phone, 
        domainName:webinfoOne.domainName,
    };
}
/*设置页面参数}}}*/

