const app = require('express')();
const debug = require('debug');
const redis = require('redis');

//全局变量设置
global.dirlist=require('./configs/dirlist');
global.configs=require(dirlist.confPath+'conf');
global.tools=require(dirlist.includePath+'publicTool');

//redis数据库初始化
tools.redisCli=redis.createClient(
    configs.redisPort,configs.redisHost);

//设置DEBUG环境变量
if(debug.enabled) debug.enable('sakj:*');


//服务器启动时的初始化工作，等前端渲染之后删掉此文件
require(dirlist.includePath+'server_init');

//服务器启动
let server = app.listen(configs.serverPort, 
    function(){
    tools.msg({
        type:'info',
        msg:'启动服务器1,地址:http://'+tools.localIP()+
            ':'+configs.serverPort
    });
});

//系统初始化
system_init(app,server);

async function system_init(app,server){
/*系统初始化{{{*/

    //参数初始化
    require(dirlist.includePath+
        'sakjmanage_init')(app);

    //管理端路由
    require(dirlist.routePath+
        'serverRoute').manageRoutes(app);

    //socket初始化
    let socket=await socket_init(server);

    //插件初始化
    let allPlus=await tools.allPlus();
    for(let key in allPlus){
        allPlus[key].obj({
            app:app,
            socket:socket
        });
    }

    //最后收尾的路由
    last_route(app);
}
/*系统初始化}}}*/

function socket_init(server){
/*socket初始化{{{*/

    //初始化参数
    let io = require('socket.io')(server),
        io_redis = require('socket.io-redis');

    //socketio对象存储在publicTools中
    tools.socketio=io;

    //socket存储在redis中
    io.adapter(io_redis({
        host:configs.redisHost, 
        port:configs.redisPort,
    }));
    io.of('/default').adapter.on('error', function(err){
        console.log('redis消息订阅出错了'+err.stack);
    });
    //socket路由
    return require(dirlist.routePath+
        'socket')(io);

}
/*socket初始化}}}*/

function last_route(app){
/*最后收尾的路由{{{*/

    //404页面
    app.use((req,res,next)=>{
        return res.status(404)
            .render('404',{layout:null}); 
    });

    //500页面
    app.use((err,req,res,next)=>{
        tools.msg({
            type:'error',
            msg:'500错误\n'+err.stack
        });
        return res.status(500)
            .render('500',{layout:null}); 
    });
    
}
/*最后收尾的路由}}}*/

