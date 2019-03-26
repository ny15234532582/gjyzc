const dataSecUser=
    require(dirlist.dataSecPath+'user');

//用户删除
module.exports=function(req,res,next){
    if(req.xhr){
        dataSecUser.deleteUser({
            users:req.body.userName,
            user:req.session.user, 
            userId:req.session.userId
        })
        .then(function(){
            return res.redirect(303,'/manage/usermanage/1'); 
        }); 
    }else next();
}
