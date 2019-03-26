const artfolderDao=require('../dao/artfolder');
const artfileDao=require('../dao/artfile');
const userDao=require(dirlist.daoPath+'user');
const posiDao=require(dirlist.daoPath+'position');

const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //通过路径查询栏目
    pathFindArtFolder:pathFindArtFolder,
    //新建栏目
    createArtFolder:createArtFolder,
    //删除栏目
    removeArtFolder:removeArtFolder,
    //重命名栏目
    renameArtFolderName:renameArtFolderName,
    //修改目录权限
    changePosiAuth:changePosiAuth,
    //获取文件夹属性
    artFolProperty:artFolProperty,
    //根据用户ID校验目录权限
    checkArtFolAuth:checkArtFolAuth,
}

async function pathFindArtFolder(params){
/*查询栏目 {{{*/
    let artfol={};
    try{
        //权限判断
        let user=await checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a'],
            errMsg:'您没有栏目['+params.path+
                ']的访问权限'});
        //获取目录
        artfol=(await artfolderDao
            .findArtFol({path:params.path}))[0];

        //如果当前栏目不存在，则创建
        if(!artfol){
            artfol=await artfolderDao.initArtFolder({
                path:params.path,
                userId:params.userId });
        }
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']访问栏目['+params.path+
                ']失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'访问栏目失败'
        });
    }
    return artfol;
}
/*查询栏目 }}}*/

async function checkArtFolAuth(params){
/*根据用户ID校验目录权限{{{*/
    let user=(await userDao
        .findUser({_id:params.userId}))[0];

    //传入的参数初始化
    let posi=(user.position 
        && user.position._id) || null;

    //如果用户为admin，或者访问目录为顶级目录，则直接通过
    if(user.userName=='admin'){
        return user;
    }
    //如果用户没有职位，则直接返回
    if(!posi){ 
        throw new Error(params.errMsg);
    }

    let artfol=await artfolderDao
        .findArtFol({path:params.path});

    let auth='b';//默认，可以查看文件
    if(artfol && artfol.creaordelposi 
        && artfol.creaordelposi.indexOf(posi)>-1)
        auth='c';//可以创建和删除文件
    else if(artfol && artfol.examineposi 
        && artfol.examineposi.indexOf(posi)>-1)
        auth='d';//可以审核文件
    else if(artfol && artfol.noentry 
        && artfol.noentry.indexOf(posi)>-1)
        auth='a';//禁止访问目录

    if(params.noAuth.indexOf(auth)>-1){ 
        throw new Error(params.errMsg);
    }
    return user;
}
/*根据用户ID校验目录权限}}}*/

async function getArtFolAuth(params){
/*根据目录和职位路径获取权限{{{*/
    //查找职位ID
    let posiId=null;
    let posis=await posiDao.findPosition({
        name:params.artfol });
    if(posis.length>1){
        posis.forEach((item)=>{
            if(depPath==item.departPath){
                posiId=item._id;
                return false;
            }
        });
    }else if(posis.length==1){
        posiId=posis[0];
    }else{
        return null;
    }
    //判断权限
    let artfol=(await artfolderDao
        .findArtFol({path:params.parFolPath}))[0];

    let auth='b';//默认，可以查看文件
    if(artfol && artfol.creaordelposi 
        && artfol.creaordelposi.indexOf(posi)>-1)
        auth='c';//可以创建和删除文件
    else if(artfol && artfol.examineposi 
        && artfol.examineposi.indexOf(posi)>-1)
        auth='d';//可以审核文件
    else if(artfol && artfol.noentry 
        && artfol.noentry.indexOf(posi)>-1)
        auth='a';//禁止访问目录

    return auth;
}
/*根据目录和职位路径获取权限}}}*/

async function createArtFolder(params){
/*新建栏目 {{{*/
    let user={};
    let nextFolName='';
    let artfol={};
    try{
        //权限判断
        user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有新建栏目['+params.path+
                ']的权限'
        });
        //获取上级栏目
        let artfolder=(await artfolderDao.findArtFol(
            {path:params.path}))[0];
        nextFolName=await nextFolderName(artfolder);
        //创建栏目
        artfol=await artfolderDao.initArtFolder({
            path:params.path+'/'+nextFolName,
            userId:params.userId});
        //与父目录建立联系
        await artfolderDao.pushLowFolder({
            path:params.path,
            folderId:artfol._id });
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在栏目['+params.path+
                ']下新建栏目['+nextFolName+']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'新建栏目成功',
            roomMsg: '用户['+user.name+
                ']在栏目['+params.path+
                ']下新建栏目['+nextFolName+']成功'
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下新建栏目['+nextFolName+']失败'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.user._id,
            msgType:'Error',
            msg:'新建栏目失败'
        });
    }
    return artfol;
}
/*新建栏目 }}}*/

async function removeArtFolder(params){
/*删除栏目{{{*/
    let data={};
    let user={};
    try{
        //权限判断
        user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有删除栏目['+params.path+
                ']的权限'
        });
        //获取当前栏目ID
        let artfol=(await artfolderDao
            .findArtFol({path:params.path}))[0];
        //删除所有文章
        await artfileDao.pathRegDelArticle(params.path);
        //删除栏目和所有子栏目
        await artfolderDao
            .pathRegDelArtFolder(params.path); 
        //从父栏目中删除当前栏目
        let nowPathAry=params.path.split('/');
        let filename=''+nowPathAry.splice(-1,1);
        nowPathAry=nowPathAry.join('/');
        await artfolderDao.pullLowFolder({
                path:nowPathAry,
                artfolId:artfol._id });
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']删除栏目['+params.path+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'删除栏目成功',
            roomMsg:'用户['+user.name+
                ']已成功删除栏目['+params.path+']'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']删除栏目['+params.path+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'删除栏目时，删除当前栏目失败'
        });
    }
    return data;
}
/*删除栏目}}}*/

async function renameArtFolderName(params){
/*重命名栏目 {{{*/
    let data={};
    let user={};
    try{
        //权限判断
        user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有重命名栏目['+params.path+
                ']的权限'
        });
        //栏目重复性检测
        let newNameNum=(await artfolderDao.findArtFol({
            path:params.path+'/'+params.newName })).length;
        if(newNameNum>0){
            throw new Error('无法重命名栏目，'+
                '因为存在相同名称的栏目');
        }
        //依次修改需要修改的栏目
        await renameLowFolders(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下将栏目['+params.oldName+
                ']重命名为['+params.newName+
                ']，已修改成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'重命名栏目成功',
            roomMsg: '用户['+user.name+
                ']在栏目['+params.nowPath+
                ']下将栏目['+params.oldName+
                ']重命名为['+params.newName+
                ']，已修改成功'
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.nowPath+
                ']下将栏目['+params.oldName+
                ']重命名为['+params.newName+
                ']失败\n'+err.stack+
                '\n参数:\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:user._id,
            msgType:'Error',
            msg:'重命名当前栏目失败',
        });
    }
    return data;
}
/*重命名栏目 }}}*/

async function artFolProperty(params){
/*获取文件夹属性{{{*/
    let cliParam={}; 
    try{
        //获取目录
        cliParam.artfol=(await artfolderDao
            .findArtFol({path:params.path}))[0];
        //文章总数 
        let allNum=await artfolderDao
            .allArticleNum(params.path);
        cliParam.allNum=allNum; 
        //获取所有职位
        cliParam.allposi=[];
        let allposiAry=await posiDao.findPosition({});
        allposiAry.forEach((item)=>{
            let posilet=item
                .department.departPath+'/'+item.name;
            posilet=posilet.replace(/^部门管理\//,'');
            cliParam.allposi.push(posilet);
        });
    }catch(err){
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'获取栏目['+params.path+
                ']的属性失败\n'+err.stack+
                '\n参数:\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'获取栏目['+params.path+
                ']的属性失败\n'+err.stack+
                '\n参数:\n\t'+JSON.stringify(params)
        });
    }
    return cliParam;
}
/*获取文件夹属性}}}*/

async function changePosiAuth(params){
/*修改目录权限{{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有修改栏目['+params.showpath+
                ']权限的权限'
        });
        //定位到当前栏目
        data=await artfolderDao
            .pathFindArtFolder(params.showpath);
        //查找职位ID
        let posiId=null;
        let posis=await posiDao.findPosition({
            name:params.posiName });
        if(posis.length>1){
            posis.forEach((item)=>{
                if(params.showpath==item.departPath){
                    posiId=item._id;
                    return false;
                }
            });
        }else if(posis.length==1){
            posiId=posis[0];
        }else{
            return null;
        }
        params.posiId=posiId;
        //更改权限
        await conversionPosiAuth(data,params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']修改['+params.showpath+
                ']的栏目权限为['+params.posiAuth+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'修改栏目权限成功',
            roomMsg:'用户['+user.name+
                ']修改['+params.showpath+
                ']的栏目权限为['+params.posiAuth+
                ']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']修改['+params.showpath+
                ']的栏目权限失败\n'+err.stack+
                '\n参数:\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'修改栏目权限失败'
        });
    };
    return data;
}
/*修改目录权限}}}*/

/**************************************/

async function nextFolderName(artfolderOne){
/* 计算下一个文件夹名称 {{{*/
    let lowFolders=artfolderOne.lowFolders;
    let maxFolderNum=0;

    if(lowFolders.length>0)
        for(let i=0;i<lowFolders.length;i++){
            let artfolName=lowFolders[i].path.slice(
                lowFolders[i].path.lastIndexOf('/')+1);
             let num=Number(
                artfolName.replace(/[^0-9]/ig,''));
             if(maxFolderNum<num) 
                maxFolderNum=num;
        }
    return '新建栏目'+(maxFolderNum+1);
}
/* 计算下一个文件夹名称 }}}*/

async function renameLowFolders(params){
/*依次修改需要修改的栏目{{{*/
    //查找需要修改的栏目
    let artfols=await artfolderDao
        .pathRegFindArtFolder(params); 
    //逐一替换
    for(let i=0;i<artfols.length;i++){
        let item=artfols[i];
        item.path=item.path.replace(
            params.path+'/'+params.oldName, 
            params.path+'/'+params.newName);
        //保存当前栏目对象
        await new Promise((resolve,reject)=>{
            item.save((err)=>{
                if(err) return reject(err); 
                resolve();
            }); 
        })
    }
    return;
}
/*依次修改需要修改的栏目}}}*/

function conversionPosiAuth(data,params){
/*修改目录权限实际方法{{{*/
    return new Promise((resolve,rejece)=>{
        //复位职位
        let creaordIndex=(data.creaordelposi || [])
            .indexOf(params.posiId);
        let examineIndex=(data.examineposi || [])
            .indexOf(params.posiId);
        let noentryIndex=(data.noentry || [])
            .indexOf(params.posiId);
        //删除旧的权限
        if(creaordIndex>-1)
            data.creaordelposi.splice(creaordIndex,1);
        if(examineIndex>-1)
            data.examineposi.splice(examineIndex,1);
        if(noentryIndex>-1)
            data.noentry.splice(noentryIndex,1);
        //存储新的权限
        switch(params.posiAuth){
            case 'a':
                data.noentry.push(params.posiId);
                break;
            case 'c':
                data.creaordelposi.push(params.posiId);
                break;
            case 'd':
                data.examineposi.push(params.posiId);
                break;
        }
        data.markModified('noentry');
        data.markModified('creaordelposi');
        data.markModified('examineposi');
        
        data.save((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        });  
    });
}
/*修改目录权限实际方法}}}*/

