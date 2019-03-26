const adminDataSec=
    require(dirlist.dataSecPath+'admin');

module.exports=function(req,res,next){

    //发送至客户端的数据
    adminDataSec.clientParams(req)
    .then((clientParams)=>{
        clientParams.layout='server';
        res.render('admin',clientParams); 
    });

}
