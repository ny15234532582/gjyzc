const artfoldermodel=require('../models/artfolder');

module.exports={
    //初始化栏目
    initArtFolder:initArtFolder,
    //增加当前栏目下的子目录
    pushLowFolder:pushLowFolder,
    //删除当前栏目下的子目录
    pullLowFolder:pullLowFolder,
    //通过路径获取栏目实体
    pathFindArtFolder:pathFindArtFolder,
    //检测栏目是否存在
    //artFolderHasBool:artFolderHasBool,
    //通过正则表达式获取栏目
    pathRegFindArtFolder:pathRegFindArtFolder,
    //根据路径返回包括子目录的总文档数量
    allArticleNum:allArticleNum,
    //按正则表达式删除栏目
    pathRegDelArtFolder:pathRegDelArtFolder,
    //根据条件获取目录
    findArtFol:findArtFol,
    //添加栏目
    addArtFol:addArtFol,
}

function initArtFolder(params){
/*初始化栏目{{{*/
    return new Promise((resolve,reject)=>{
        let artfolderOne={
            path:params.path,
            lowFolders:[],
            artfiles:[],
            createDate:new Date(),
            createUser:params.userId, }

        new artfoldermodel(artfolderOne)
        .save((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        });  
    });
}
/*初始化栏目}}}*/

function pushLowFolder(params){
/*增加当前栏目下的子栏目{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.updateOne(
            {path:params.path},
            {$push:{lowFolders:params.folderId }},
            {upsert:true},
            (err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        }); 
    });
}
/*增加当前栏目下的子栏目}}}*/

function pullLowFolder(params){
/*删除当前栏目下的子栏目{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.updateOne(
            {path:params.path},
            {$pull:{lowFolders:params.artfolId }},
            (err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        }); 
    }) 
}
/*删除当前栏目下的子栏目}}}*/

function pathFindArtFolder(path){
/*通过路径获取栏目实体{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.findOne(
            {path:path})
        .exec((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        }); 
    }); 
};
/*通过路径获取栏目实体}}}*/

function artFolderHasBool(params){
/*检测栏目是否存在{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.findOne(
            {path:params.nowPath,
             lowFolders:params.newName})
        .exec((err,artfolderOne)=>{
            if(err) return reject(err);
            if(artfolderOne)
                resolve(true);
            else resolve(false); }); });
}
/*检测栏目是否存在}}}*/

function pathRegFindArtFolder(params){
/*通过正则表达式获取栏目{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.find(
            {path:{$regex:'^'+(params.path+
                '/'+params.oldName)+'($|/)'}})
        .exec((err,artfolders)=>{
            if(err) return reject(err);
            resolve(artfolders); 
        }); 
    }); 
}
/*通过正则表达式获取栏目}}}*/

function allArticleNum(path){
/*根据路径返回包括子目录的总文档数量{{{*/
    return new Promise(function(resolve,reject){
        artfoldermodel.find(
            {path:{$regex:'^'+path+'($|/)'}},
            {'artfiles':1},
            function(err,artfolders){
                if(err) return reject(err);
                var allNum=0;
                artfolders.forEach((item,index)=>{
                    allNum+=item.artfiles.length;
                });
                resolve(allNum); 
            });
    });
}
/*根据路径返回包括子目录的总文档数量}}}*/

function pathRegDelArtFolder(path){
/*按正则表达式删除栏目{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.deleteMany({
            path:{$regex:'^'+path+'($|/)'} },
        function(err,data){
            if(err) return reject(err);
            resolve(data); 
        }); 
    }); 
};
/*按正则表达式删除栏目}}}*/

function findArtFol(where){
/*根据条件获取目录{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.find(where)
        .populate('artfiles')
        .populate('lowFolders')
        .populate('createUser')
        .populate('creaordelposi')
        .populate('examineposi')
        .populate('noentry')
        .exec((err,artfolders)=>{
            if(err) return reject(err);
            resolve(artfolders); 
        }); 
    }); 
}
/*根据条件获取目录}}}*/

function addArtFol(artfol){
/*添加栏目{{{*/
    return new Promise((resolve,reject)=>{
        new artfoldermodel(artfol)
        .save((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        });  
    });
}
/*添加栏目}}}*/

