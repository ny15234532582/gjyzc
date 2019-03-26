const userDataSec=
    require(dirlist.dataSecPath+'user');

//添加用户
module.exports=function(req,res,next){
    if(req.xhr){
        //需要传递的参数
        let params=req.body;
        params.belongToRole=req.body.belongToRole;
        params.userName=req.params.userName;
        params.userId=req.session.userId;

        //添加用户
        userDataSec.userAdd(params)
        //跳转当前用户管理界面
        .then(()=>{ 
            return res.redirect(303,
                '/manage/usermanage/'+req.body.pageNum); 
        });
    }else next();
}
