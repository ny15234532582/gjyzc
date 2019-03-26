const dataSecChatOn=require('../dataSecurity/chatOnline');

module.exports=function(req,res,next){
    dataSecChatOn.uidMsg({
        userId:req.session.userId,
        otherUserId:req.query.userId})
    .then((allMsg)=>{
        res.render('plus/chatOnline/chatOnlinePage',{
            layout:null,
            allmsg:allMsg,
            userId:req.query.userId,
        });
    });
}
