const debug=require('debug');
const redis=require('redis');

//全局变量设置
global.dirlist=require('./configs/dirlist');
global.configs=require(dirlist.confPath+'conf');
global.tools=require(dirlist.includePath+'publicTool');

//redis数据库初始化
tools.redisCli=redis.createClient(
    configs.redisPort,configs.redisHost);

//设置DEBUG环境变量
if(debug.enabled) debug.enable('sakj:*');

//启用集群
require(dirlist.includePath+'sakjmanage_cluster');

