const fs=require('fs');
const path=require('path');
const formidable=require('formidable');
const artDataSec=require('../../dataSecurity/artfile');

module.exports=function(req,res,next){

    if(req.xhr){
        //修改文章
        saveArtfile(req)
        .then(()=>{
            return res.json({ 
                status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' 
            });
        },(err)=>{
            return res.json({ 
                status:true,
                newPath:escape(req.session.showPath),
                redirectUrl:'/manage/artfolder' 
            }); 
        });
    }else next();
}

async function saveArtfile(req){
/*修改文章{{{*/
    //解析multipart/form-data数据
    let formData=await formParse(req);
    let fields=formData.fields;
    let files=formData.files;
    //修改文章
    await artDataSec.changeArtFile({
        userId:req.session.userId,
        path:req.session.showPath,
        title:formData.fields.oldTitle,
        artfile:{
            title:fields.title, 
            titleImg:(()=>{
                if(!files.logo) return;
                let imgPath=files.logo.path;
                let subLength=dirlist.staticPath.length;
                return imgPath.substring(subLength-1);
            })(),
            skipLink:fields.skipLink,
            summary:fields.summary,
            ArtContent:fields.editorContain,
        }
    }); 
    return;
}
/*修改文章}}}*/

function formParse(req){
/*解析multipart/form-data数据{{{*/
    return new Promise((resolve,reject)=>{
        let form=new formidable.IncomingForm();
        //图片存储目录
        form.uploadDir=configs.imgUpdataPath;
        //解析数据
        form.parse(req,(err,fields,files)=>{
            if(err) return reject(err);
            resolve({
                fields:fields,
                files:files
            });
        }); 
    });
}
/*解析multipart/form-data数据}}}*/

