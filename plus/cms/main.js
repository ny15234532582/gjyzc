const artfolRoute=
    require(__dirname+'/routes/artfolder');
const artfileRoute=
    require(__dirname+'/routes/artfile');

module.exports=function(params){
    let app=params.app;
    let socket=params.socket;
    //http访问接口路由注册
    artfolRoute(app);
    artfileRoute(app);
}
