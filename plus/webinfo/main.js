const baseRoute=
    require(__dirname+'/routes/webinfo');

module.exports=function(params){
    let app=params.app;
    let socket=params.socket;
    //http访问接口路由注册
    baseRoute(app);
}
