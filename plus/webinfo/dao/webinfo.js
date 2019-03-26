const webinfo=require('../models/webInfo');

module.exports={
    //添加web信息
    addWebInfo:addWebInfo,
    //更新web信息
    updateWebInfo:updateWebInfo,
    //查找web信息
    findWebInfo:findWebInfo,
}

function addWebInfo(params){
/*增加一条新的网站信息{{{*/
    return new Promise((resolve,reject)=>{
        new webinfo({
            webName:params.webName,
            logo:params.logo,
            companyName:params.companyName,
            address:params.address,
            phone:params.phone,
            domainName:params.domainName
        }).save((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        }); 
    }); 
}
/*增加一条新的网站信息}}}*/

function updateWebInfo(params){
/*更新网站信息 {{{*/
    return new Promise((resolve,reject)=>{
        findWebInfo()
        .then((nowWebInfo)=>{
            params.webName && 
                (nowWebInfo.webName=params.webName);
            params.logo && 
                (nowWebInfo.logo=params.logo);
            params.companyName && 
                (nowWebInfo.companyName=params.companyName);
            params.address && 
                (nowWebInfo.address=params.address);
            params.phone && 
                (nowWebInfo.phone=params.phone);
            params.domainName && 
                (nowWebInfo.domainName=params.domainName);
            //保存至数据库
            nowWebInfo.save((err,data)=>{
                if(err) return reject(err);
                resolve(data); 
            }) 
        }); 
    }); 
}
/*更新网站信息 }}}*/

function findWebInfo(){
/*查找当前网站信息 {{{*/
    return new Promise((resolve,reject)=>{
        webinfo.findOne((err,webInfo)=>{
            if(err) return reject(err);
            resolve(webInfo); 
        }); 
    }); 
}
/*查找当前网站信息 }}}*/

