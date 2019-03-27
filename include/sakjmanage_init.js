const fs=require('fs');
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');
const redisStore=require('connect-redis')(session);
const handlebars=require('express-handlebars').create();

module.exports=function(app){

    //处理未捕获的异常
    require(dirlist.includePath+'sakjmanage_domain')(app);

    //设置handlebars视图引擎
    app.engine('handlebars',handlebars.engine);
    app.set('view engine','handlebars');

    //mongodb数据库初始化
    let dbHost=configs.dbHost || 'localhost';
    let dbPort=configs.dbPort || '27017';
    let dbName=configs.dbName || '';
    mongoose.connect('mongodb://'+dbHost+':'+dbPort+'/'+dbName,
        {useNewUrlParser:true,
         keepAlive:true});

    //端口
    app.set('port', configs.serverPort);
    //静态目录
    app.use(express.static(dirlist.staticPath));

    //设置插件的静态目录，以/plus/插件目录名称为前缀
    plusPublic(app);
    
    //设置body,cookie
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    //设置session
    let redisStoreVar=
        new redisStore({client:tools.redisCli});
    app.use(session({
        prefix:configs.sessPrefix,
        name:configs.sessName,
        resave:configs.sessResave,
        saveUninitialized:configs.sessSaveUninitialized,
        secret:configs.cookieSecret,
        cookie:{maxAge:configs.loginOfTime},
        store:redisStoreVar,
    }));

    //初始化图片上传路径
    fs.existsSync(configs.imgUpdataPath) || 
        fs.mkdirSync(configs.imgUpdataPath);
}

async function plusPublic(app){
/*设置插件的静态目录{{{*/
    let allPlus=await fs.readdirSync(dirlist.plusPath)
    allPlus.forEach((item)=>{
        app.get('/plus/'+item+'/*',(req,res,next)=>{
            //获取文件路径
            let path=req.url.split('?')[0];
            let item=path.split('/')[2];
            path=path.replace(/^\/\w+\/\w+\//,'');
            //文件存在则发送文件，不存在则跳过
            let filePath=dirlist.plusPath+item+'/public/'+path;
            if(fs.existsSync(filePath)){
                fs.createReadStream(filePath).pipe(res);
            }else{
                next();
            }
        });
    });
    return;
}
/*设置插件的静态目录}}}*/

