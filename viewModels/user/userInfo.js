const moment=require('moment');

const dataSecUser=
    require(dirlist.dataSecPath+'user');

//显示用户信息
module.exports=function(req,res,next){
    if(req.xhr){
        dataSecUser.userNamefindUser({
            userId:req.session.userId,
            userName:req.params.userName })
        .then((userOne)=>{
            //传给客户JSON数据
            if(userOne) res.json({
                userName:userOne.userName,
                name:userOne.name,
                phone:userOne.phone,
                Email:userOne.Email,
                address:userOne.address,
                qq:userOne.qq,
                weixin:userOne.weixin,
                departPath:userOne.departPath,
                position:userOne.position.name,
                createdAt:(()=>{
                    if(!userOne.created_at) return '';
                    var createDateformat=
                        moment(userOne.created_at)
                        .format('YYYY-MM-DD');
                    return createDateformat; 
                })() 
            });
        });
    }else next(); }
