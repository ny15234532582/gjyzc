const moment=require('moment');

const artfolDataSec=require('../../dataSecurity/artfolder');

//打开目录属性
module.exports=function(req,res,next){

    if(req.xhr){
        let pageParams={};

        artfolDataSec.artFolProperty({
            path:req.session.showPath+'/'+
                req.query.filename })
        .then((cliParams)=>{
            pageParams.childFolderNumber=
                cliParams.artfol.lowFolders.length;
            pageParams.childArtNumber=
                cliParams.artfol.artfiles.length;
            pageParams.createDate=
                moment(cliParams.artfol.createDate)
                .format('YYYY-MM-DD');
            pageParams.artfolderName=req.query.filename;
            pageParams.createUser=
                cliParams.artfol.createUser.name;
            pageParams.allchildArtNumber=cliParams.allNum;
            pageParams.allposi=cliParams.allposi;
            return res.render('plus/artfolder/artfolProp',
                pageParams); 
        });

    }else next(); 
}
