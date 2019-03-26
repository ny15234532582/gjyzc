const dataSecUser=
    require(dirlist.dataSecPath+'user');
//重置用户密码
module.exports=function(req,res,next){
    if(req.xhr){
        dataSecUser.resetPass({
            userId:req.session.userId,
            userNames:req.body.userNames })
        .then(()=>{
            return res.redirect(303,'/manage/usermanage/1'); 
        }); 
    }else next();
}
