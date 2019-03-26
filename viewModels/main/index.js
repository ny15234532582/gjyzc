const mainDataSec=
    require(dirlist.dataSecPath+'main');

module.exports=function(req,res,next){
    mainDataSec.indexData()
    .then((data)=>{
        data.layout='main';
        res.render('main/index',data); 
    });
}
