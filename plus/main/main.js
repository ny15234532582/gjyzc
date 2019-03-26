const mainRoute=
    require(__dirname+'/routes/main');

module.exports=function(params){
    console.log('...');
    let app=params.app;
    let socket=params.socket;
    //http访问接口路由注册
    mainRoute(app);
}
