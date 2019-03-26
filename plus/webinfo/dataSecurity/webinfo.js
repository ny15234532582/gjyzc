const path=require('path');
const formidable=require('formidable');
const debug=require('debug')('sakj:webinfo');

const webInfoDao=require('../dao/webinfo');
const userCacheDao=require(dirlist.daoPath+'userCache');
const sockDataSec=require(dirlist.dataSecPath+'socket');
    
module.exports={
    //向数据库提交web信息 
    posiWebInfo:posiWebInfo,
    //打开web信息修改页面时，从数据库获取数据
    getWebInfo:getWebInfo,
}

async function posiWebInfo(req){
/* 添加webInfo信息 {{{*/
    let clientWebInfo=null;
    let user={};
    try{
        //权限判断
        user=await tools.isAdmin({
            userId:req.session.userId,
            msg:'您没有权限修改CMS基本信息'});

        let form=new formidable.IncomingForm();
        //图片存储目录
        form.uploadDir=configs.imgUpdataPath;

        //解析上传的表单
        clientWebInfo=await decodForming({
            req:req,
            form:form });
        clientWebInfo.userId=req.session.userId;

        //决定是更新还是添加网站信息
        if(await webInfoDao.findWebInfo()){
            await webInfoDao.updateWebInfo(clientWebInfo);
        }else{
            await webInfoDao.addWebInfo(clientWebInfo);
        }

        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:req.session.userId,
            msg:'用户['+req.session.userId+
                ']修改CMS基本信息成功'
        });
        sockDataSec.sendMsg({
            userId:req.session.userId,
            msgType:'Find',
            msg:'修改网站信息成功',
            roomMsg:'用户['+user.name+
                ']修改网站信息成功'});

    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:req.session.userId,
            msg:'用户['+req.session.userId+
                ']修改网站信息失败\n'+err.stack
        });
        sockDataSec.sendMsg({
            userId:req.session.userId,
            msgType:'Error',
            msg:'修改网站信息失败'
        });
    }
    return clientWebInfo;
}
/* 修正标题图片路径 }}}*/

function decodForming(params){
/*解析用户上传的表单{{{*/
    let req=params.req;
    let form=params.form;
    return new Promise((resolve,reject)=>{
        //客户端上传表单解析
        form.parse(req,function(err,fields,files){
            if(err) return reject(err);

            //修正标题图片路径
            let flpPath='';
            if(files && files.logo){
                let flp=files.logo.path;
                let subLength= 
                    path.join(dirlist.staticPath,'../public').length;
                flpPath=flp.substring(subLength,flp.length);
            }

            //客户端上传的网站信息
            let clientWebInfo={
                webName:fields.webName,
                logo:flpPath,
                companyName:fields.companyName,
                address:fields.address,
                phone:fields.phone,
                domainName:fields.domainName }

            return resolve(clientWebInfo); 
        }); 
    }); 
}
/*解析用户上传的表单}}}*/

async function getWebInfo(params){
/*打开web信息修改页面时，从数据库获取数据{{{*/
    let webinfo={};
    try{
        webinfo=await webInfoDao.findWebInfo();
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']获取CMS基本信息时发生错误'+err.stack
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'基本信息时发生错误',
        });
    }
    return webinfo;
}
/*打开web信息修改页面时，从数据库获取数据}}}*/

