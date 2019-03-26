const dataSecChatOn=require('../dataSecurity/chatOnline');

module.exports=function(req,res,next){
    //获取在线用户面板
    dataSecChatOn.allUser({
        userId:req.session.userId })
    .then((allUserAry)=>{
        res.render('plus/chatOnline/onlineList',
            {allUser:allUserAry}
        );
    });
}
