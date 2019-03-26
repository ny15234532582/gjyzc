const vmConn=
    require(dirlist.viewModelPath+'socket/connection');
const vmcliMsg=
    require(dirlist.viewModelPath+'socket/clientMessage');
const vmdisConn=
    require(dirlist.viewModelPath+'socket/disconnect');
const plusCliInit=
    require(dirlist.viewModelPath+'socket/plusCliInit');

module.exports=function(io){
    return new Promise((resolve,reject)=>{
        let socketTop=io.of('/default');

        socketTop.on('connection',(socket)=>{
            //连接初始化
            vmConn(socket);

            socket.on('clientMessage',vmcliMsg);

            socket.on('disconnect',vmdisConn(socket));

            //客户端socket路由初始化
            socket.on('plusCliInit',plusCliInit(socket));

            resolve(socket);
        });
    });
}
