const artfileDao=require('../dao/artfile');
const artFolDataSec=require('../dataSecurity/artfolder');
const artfolderDao=require('../dao/artfolder');

const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //查询文章
    findArticle:findArticle,
    //新建文章
    createArtFile:createArtFile,
    //修改文章
    changeArtFile:changeArtFile,
    //重命名文章
    renameArtFile:renameArtFile,
    //删除文章
    removeArticle:removeArticle,
}

async function findArticle(params){
/*查询文章{{{*/
    let article=null;
    try{
        //权限判断
        await artFolDataSec.checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a'],
            errMsg:'您没有栏目['+params.path+
                   ']的访问权限' });
        //从数据库获取当前文章
        article=(await artfileDao.findArticle({
            path:params.path,
            title:params.fileName }))[0]; 
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'职位['+params.posi+
                ']查找位于栏目['+params.showPath+
                ']下的文章['+params.fileName+
                ']，无法查找到相应文章\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });

        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg: '查找文章失败，'+
                '因为无法定位到该文章'
        });
    }
    return article;
}
/*查询文章}}}*/

async function createArtFile(params){
/*新建文章{{{*/
    let data;
    let user=null;
    let artfileTitle='';
    try{
        //权限判断
        user=await artFolDataSec.checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a','b'],
            errMsg:'您没有在栏目['+params.path+
                   ']下新建文章的权限' });
        //获取目录
        artfol=(await artfolderDao
            .findArtFol({path:params.path}))[0];
        //获取下一个文章名称
        artfileTitle=nextFileName(artfol);
        //创建文章
        let artfile=await artfileDao.initArtFile({
            artfolder:artfol._id,  
            path:artfol.path,
            title:artfileTitle });
        params.artId=artfile._id;
        //文章与目录进行关联
        data=await artfileDao.createArtFile(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在栏目['+params.path+
                ']下新建文章['+artfileTitle+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'新建文章成功',
            roomMsg: '用户['+user.name+
                ']在栏目['+params.path+
                ']下新建文章['+artfileTitle+
                ']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下新建文章['+artfileTitle+
                ']失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'新建文章失败'
        });
    }
    return data;


}
/*新建文章}}}*/

async function changeArtFile(params){
/*修改文章{{{*/
    let user,
        data;
    try{
        //权限判断
        user=await artFolDataSec.checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a','b'],
            errMsg:'您没有在栏目['+params.path+
                   ']下修改文章的权限' });
        //获取当前文章
        let article=(await artfileDao.findArticle({
            path:params.path,
            title:params.title 
        }))[0]; 
        //更新文章
        data=await artfileDao.updateArtFile({
            artId:article._id,
            artfile:params.artfile }); 
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下更新文章['+params.artfile.title+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'更新文章成功',
            roomMsg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下更新文章['+params.artfile.title+
                ']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下更新文章['+params.artfile.title+
                ']失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'更新文章失败'
        });
    }
    return data;
}
/*修改文章}}}*/

async function renameArtFile(params){
/*重命名文章{{{*/
    let user=null;
    let data={};
    //如果不需要重命名则直接返回
    if(params.fileName===params.newName){
        return;
    }
    try{
        //权限判断
        user=await artFolDataSec.checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a','b'],
            errMsg:'您没有在栏目['+params.path+
                   ']下新建文章的权限' });
        //文章重命名检测
        params.artId=null;
        let artfol=(await artfolderDao
            .findArtFol({path:params.path}))[0];
        artfol && artfol.artfiles &&
            artfol.artfiles.forEach((item)=>{
            if(item.title==params.fileName){
                params.artId=item._id;
            }
            if(item.title==params.newName){
                throw new Error('无法重命名文章，'+
                    '因为存在相同名称的文章'); 
            }
        });
        //修改文章实体
        data=await artfileDao.renameArtFile(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在栏目['+params.path+
                ']下修改文章['+params.fileName+
                ']名为['+params.newName+']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'文章重命名成功',
            roomMsg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下修改文章['+params.fileName+
                ']名为['+params.newName+']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下修改文章['+params.fileName+
                ']名为['+params.newName+
                ']失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'重命名文章失败'
        });
    }
    return data;
}
/*重命名文章}}}*/

async function removeArticle(params){
/*删除文章{{{*/
    let data;
    let user;
    try{
        //权限判断
        user=await artFolDataSec.checkArtFolAuth({
            path:params.path,
            userId:params.userId,
            noAuth:['a','b'],
            errMsg:'您没有在栏目['+params.path+
                   ']下删除文章的权限' });
        //获取当前文章
        let artfile=(await artfileDao.findArticle({
            path:params.path,
            title:params.filename }))[0];
        params.artId=artfile._id;
        //删除文章
        await artfileDao.removeArticle({_id:params.artId});
        //在栏目中删除文章
        data=await artfileDao.removeArtFileIndex(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在栏目['+params.path+
                ']下删除文章['+params.filename+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'删除文章成功',
            roomMsg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下删除文章['+params.filename+
                ']成功'
        });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+user.name+
                ']在栏目['+params.path+
                ']下删除文章['+params.filename+
                ']失败\n'+err.stack+
                '\n参数：\n'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'删除文章失败'
        });
    }
    return ;
}
/*删除文章}}}*/

/***************************************/

function nextFileName(artfolderOne){
/* 计算下一个文章名称为最大数 {{{*/
    let lowFiles=artfolderOne.artfiles;
    let maxfileNum=0;
    for(let i=0;i<lowFiles.length;i++){
         let num=
            Number(lowFiles[i].title.replace(/[^0-9]/ig,''));
         if(maxfileNum<num) maxfileNum=num; 
    }
    return '新建文件'+(maxfileNum+1); 
}
/* 计算下一个文章名称为最大数 }}}*/

