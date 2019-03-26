const baseRoute=
    require(__dirname+'/routes/baseRoute');
const socketRoute=
    require(__dirname+'/routes/socketRoute');

module.exports=function(params){
    let app=params.app;
    let socket=params.socket;

    //http访问接口路由注册
    baseRoute(app);
    //socket路由注册
    socketRoute(socket);
}
