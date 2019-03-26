var path=require('path');

module.exports={
    //服务器运行端口
    serverPort:8800,

    //图片上传路径
    imgUpdataPath:path.join(__dirname,'../public/img'),
    //日志目录
    logsPath:path.join(dirlist.rootPath,'logs/'),

    //数据库连接
    dbHost:'localhost',
    dbPort:27017,
    dbName:'xtj',
    
    //redis相关参数
    redisPort:6379,
    redisHost:'localhost',

    //session相关设置
    sessPrefix:'sess',
    sessName:'connect.sid',
    sessResave:false,
    sessSaveUninitialized:false,
    cookieSecret:'adfibq32oaas%^&@',

    //user与session在redis的映射前缀
    user_sess_prefix:'user_sess',
    //用户登陆持续时间
    //一个星期
    loginOfTime:1000*60*60*24*7,

    hooksSecret:"niusantu.319",
}
