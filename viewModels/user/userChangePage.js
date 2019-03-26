const userDataSec=require(dirlist.dataSecPath+'user');

//获取用户修改界面
module.exports=function(req,res,next){
    if(req.xhr){

        userDataSec.userChangeParm({
            userId:req.session.userId, 
            userName:req.params.userName })
        .then((data)=>{

            let cliParams={ layout:null, 
                allPosi:data.allposi,
                userOne:data.user};
            return res.render('actionPanel/adduser',cliParams);
        });

    }else next(); 
}
