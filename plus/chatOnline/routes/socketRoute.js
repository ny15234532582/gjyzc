const forwardMsg=require('../viewModels/forwardMsg.js');

//socket路由
module.exports=function(socket){
    //服务器接收到客户端的消息，将会中转发送至特定的客户端
    socket.on('chatOnlineCli',forwardMsg);
}

