const socketDataSec=
    require(dirlist.dataSecPath+'socket');

module.exports=(socket)=>{
    //退出系统
    return ()=>{
        socketDataSec.socket_disconn(socket)
        .then((user)=>{
            socket.broadcast.emit('serverMessage',
                {msgType:'Info',
                 msg:'职位:['+user.nowposi+
                     ']用户['+user.name+
                     ']退出系统'
            });
        });
    }
};

