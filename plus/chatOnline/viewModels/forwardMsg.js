const dataSecChatOn=require('../dataSecurity/chatOnline');

module.exports=function(params){
//转发客户端之间的信息

    dataSecChatOn.forwardMsg(params)
    .then((data)=>{
        let otherInfo=data.otherInfo;
        let nowInfo=data.nowInfo;

        //向对方发送信息
        otherInfo.sock.emit('chatOnlineSer',{
            userName:nowInfo.user.name,
            userId:nowInfo.user._id,
            msg:params.msg 
        });
        //向本人发送信息
        nowInfo.sock.emit('chatOnlineSer',{
            userName:"我",
            userId:otherInfo.user._id,
            msg:params.msg 
        });

    });
}
