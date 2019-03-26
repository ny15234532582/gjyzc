const socketDataSec=
    require(dirlist.dataSecPath+'socket');

//初始化连接
module.exports=(socket)=>{
    socketDataSec.socket_conn(socket)
    .then((data)=>{

        let user=data.user;
        let oldSocketId=data.oldSocketId;

        //将在线的当前用户退出系统
        socket.broadcast.emit('logout',oldSocketId);

        socket.emit('serverMessage',{
            msgType:'Info',
            msg:'欢迎登陆本系统'
        });
        socket.broadcast.emit('serverMessage',{
            msgType:'Info',
            msg:'用户['+user.name+
                ']已登陆本系统' });
    },(err)=>{
        socket.emit('serverMessage',{
            msgType:'Error',
            msg:'初始化连接失败，请联系系统管理员\n'+err.stack,
        });
    });

}
