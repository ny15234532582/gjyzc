const mainDataSec=
    require(dirlist.dataSecPath+'main');

module.exports=function(req,res,next){
    mainDataSec.leaveMsg()
    .then((data)=>{
        data.layout='main';
        res.render('main/leaveMsg',data);
    });
}
