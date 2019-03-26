const dataSecUser=
    require(dirlist.dataSecPath+'user');

module.exports=function(req,res,next){
    if(req.xhr){
        
        var userNames=req.body.userNames;
        if(!userNames) return next();

        //向客户端返回数据
        dataSecUser.userChangeDisable({ 
            userNames:userNames,
            userId:req.session.userId,
            enable:false })
        .then((data)=>{
            return res.json({
                status:true,
                updataResult:data 
            }); 
        });
    }else next();
}
