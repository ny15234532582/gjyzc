const mainDataSec=
    require(dirlist.dataSecPath+'main');

module.exports=function(req,res,next){

    mainDataSec.detailData({
        path:req.query.path, 
        artId:req.query.artId })
    .then((data)=>{
        data.layout='main';
        res.render('main/detail',data); 
    });
}
