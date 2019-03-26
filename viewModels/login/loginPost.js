const userDataSec=
    require(dirlist.dataSecPath+'user');

module.exports=function(req,res,next){

    //用户登陆模块
    userDataSec.userLogin({
        userName:req.body.userName || '',
        password:req.body.password || '',
        req:req, })
    .then((status)=>{

        //验证失败
        if(!status.stat) 
            return res.json({ status:false, 
                msg:status.msg }); 

        //登陆成功，跳转至后台首页
        return res.json({ status:true,
            userName:status.user.nowposi+
                '/'+status.user.name,
            msg:'登陆成功，即将跳转' }); 

    },(err)=>{
        next(err);
    });
}

