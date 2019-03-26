//向客户端发送提示信息
module.exports=function(socket){
    return (content)=>{

        socket.emit('serverMessage',
            {msg:content,msgType:'Info'});
    }
}
