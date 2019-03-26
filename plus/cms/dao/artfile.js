const articlemodel=require('../models/article');
const artfoldermodel=require('../models/artfolder');

module.exports={
    //创建文章
    createArtFile:createArtFile,
    //初始化文章
    initArtFile:initArtFile,
    //更新文章实体
    updateArtFile:updateArtFile,
    //重命名文章
    renameArtFile:renameArtFile,
    //查询文章
    findArticle:findArticle, 
    //删除文章
    removeArticle:removeArticle,
    //按正则表达式删除文章
    pathRegDelArticle:pathRegDelArticle,
    //删除父目录表中的文章索引
    removeArtFileIndex:removeArtFileIndex,
}

function createArtFile(params){
/*创建文章{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.updateOne(
            {path:params.path},
            {$push:{artfiles:params.artId}},
            {upsert:true},
            (err,data)=>{
                if(err) return reject(err);
                resolve(data);
            });
    }); 
}
/*创建文章}}}*/

function initArtFile(params){
/*初始化文章{{{*/
    return new Promise(function(resolve,reject){
        let articleOne=new articlemodel({
            artfolder:params.artfolder,
            path:params.path,
            title:params.title});
            /*
            path:params.top_showPath,
            title:params.top_fields.title,
            titleImg:(params.top_files.logo && 
                params.top_files.logo.path) || '',
            skipLink:params.top_fields.skipLink,
            releaseDate:new Date(),
            readNumber:0,
            summary:params.top_fields.summary,
            ArtContent:params.top_fields.editorContain });
            */
        articleOne.save(function(err){
            if(err) return reject(err);
            resolve(articleOne); 
        }); 
    }) 
}
/*初始化文章}}}*/

function updateArtFile(params){
/*更新文章实体{{{*/
    return new Promise((resolve,reject)=>{
        articlemodel.updateOne(
            {_id:params.artId},
            params.artfile,
            {upsert:true},
            (err,data)=>{
                if(err) 
                    return reject(err);
                resolve(data); 
        }); 
    }) 
}
/*更新文章实体}}}*/

function renameArtFile(params){
/*重命名文章{{{*/
    return new Promise((resolve,reject)=>{
        articlemodel.updateOne(
            {_id:params.artId},
            {$set:{title:params.newName}},
            (err,data)=>{ 
                if(err) return reject(err);
                resolve(data); 
            }); 
    }) 
}
/*重命名文章}}}*/

function findArticle(where){
/*查询文章{{{*/
    return new Promise((resolve,reject)=>{
        articlemodel.find(where)
        .populate('artfolder')
        .exec((err,article)=>{
            if(err) return reject(err);
            resolve(article); 
        }); 
     }); 
}
/*查询文章}}}*/

function removeArticle(params){
/*删除文章{{{*/
    return new Promise((resolve,reject)=>{
        articlemodel.deleteOne(params) 
        .exec((err,data)=>{
            if(err) return reject(err);
            resolve(data); 
        }); 
    }); 
}
/*删除文章}}}*/

function pathRegDelArticle(removepath){
/*按正则表达式删除文章{{{*/
    return new Promise((resolve,reject)=>{
        articlemodel.deleteMany({
            path:{$regex:'^'+removepath+'($|/)'}
        },(err,data)=>{ 
            if(err) return reject(err);
            resolve(data); 
        }); 
    }); 
}
/*按正则表达式删除文章}}}*/

function removeArtFileIndex(params){
/*删除父目录表中的文章索引{{{*/
    return new Promise((resolve,reject)=>{
        artfoldermodel.updateOne(
            { path:params.showPath },
            { $pull:{artfiles:params.artId } },
            (err)=>{ 
                if(err) return reject(err);
                resolve(); 
            }); 
    }); 
}
/*删除父目录表中的文章索引}}}*/

