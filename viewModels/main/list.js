const mainDataSec=
    require(dirlist.dataSecPath+'main');

module.exports=function(req,res,next){

    mainDataSec.listData({
        path:req.query.path,
        oneNum:10,
        page:req.query.page})
    .then((data)=>{
        data.layout='main';
        res.render('main/list',data); 
    });
}
