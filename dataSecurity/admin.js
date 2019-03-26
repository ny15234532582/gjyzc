const userCacheDao=require(dirlist.daoPath+'userCache');
const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //设置传给客户端的页面参数
    clientParams:clientParams,
}

async function clientParams(req){
/*设置传给客户端的页面参数{{{*/
    let clientParams={};
    try{
        clientParams.clientIP=
            req.ip.match(/\d+.\d+.\d+.\d+/) || '127.0.0.1';
        clientParams.webPath=dirlist.rootPath;
        clientParams.fileUpPath=configs.imgUpdataPath;
        clientParams.serverName=process.env.HOSTNAME;
        clientParams.serverIP=tools.localIP();
        clientParams.nodeVersion=process.version;
        clientParams.webport=configs.serverPort;
        clientParams.nodePath=process.env._;
        clientParams.adminPath='/manage'; 
        let user=await userCacheDao
            .getValFromCache({
                userId:req.session.userId,  
                key:'Info' });
        clientParams.user=JSON.parse(user);
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:req.session.userId,
            msg:'获取管理页首页数据发生错误'
        });
    }

    return clientParams;
}
/*设置传给客户端的页面参数}}}*/

