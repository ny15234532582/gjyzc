const dataSecUser=
    require(dirlist.dataSecPath+'user');

//判断用户是否存在
module.exports=function(req,res,next){

    if(!req.body.userName) return res.json({});

    //获取用户实体
    dataSecUser.checkUserFirstLogin(req.body.userName)
    .then((bool)=>{
        if(bool) return res.json({
            status:true,isUserFirstLogin:true});
    },(err)=>{
        return res.json(
            {status:false,msg:'查询数据库失败'}); 
    });
}
