const socketDataSec=
    require(dirlist.dataSecPath+'socket');

module.exports=function(req,res,next){
    socketDataSec.userLogout({
        userId:req.session.userId, })
    .then(()=>{
        //注销session
        req.session.destroy();
        return res.redirect(303,'/manage');
    },(err)=>{ 
        next(err);
    });
}
