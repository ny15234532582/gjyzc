const fs = require('fs');
const moment=require('moment');
const cookie=require('cookie');
const signature=require('cookie-signature')
const debug=require('debug')('sakj:core');
const dataSecLog=require(dirlist.dataSecPath+'log');
const userCacheDao=
    require(dirlist.daoPath+'userCache');
const sockDataSec=
    require(dirlist.dataSecPath+'socket');

//所有插件
var plus=null;

module.exports={
    //redis缓存数据库,在sakjmanage_init.js处初始化
    redisCli:null,
    //require(socket.io)的socket设置，
    //在sakjmanage_cluster.js处初始化
    socketio:null,
    //socket汇总，通过ID映射
    uidsocks:{},
    //所有插件
    allPlus:allPlus,
    //日志消息记录
    msg:saveMsg,
    //判断是否为admin
    isAdmin:isAdmin,
    //获取本地IP
    localIP:localIP,
}

async function allPlus(){
/*获取所有的插件{{{*/
    if(plus) return plus;
    else plus={};

    await fs.readdirSync(dirlist.plusPath)
        .forEach((item)=>{

        let path=dirlist.plusPath+item+'/';
        let stat=fs.statSync(path);
        if(stat.isDirectory()){
            let packjson=fs.readFileSync(path+'/package.json');
            plus[item]={
                obj:require(path),
                pack:JSON.parse(packjson)
            }
        }
    });
    return plus;
}
/*获取所有的插件}}}*/

async function saveMsg(params){
/*保存系统的消息记录{{{*/

    //消息前面加上时间
    let date=moment().utcOffset(480)
        .format('YYYY-MM-DD HH:mm:ss');
    params.msg='['+date+'] '+params.msg;

    //如果为用户日志数据则存储到redis用户缓存中
    if(params.userId && tools.redisCli)
        dataSecLog.addLog(params);
     
    //根据情况进行debug输出
    if(params.type=='info'){
        //常规输出
        debug(params.msg);
    }else if(params.type='error'){
        //常规输出
        debug(params.msg);
    }

}
/*保存系统的消息记录}}}*/

async function isAdmin(params){
/*判断是否为Admin{{{*/
    
    //从缓存中根据userId获取用户实体
    let user=await userCacheDao.getValFromCache({
        userId:params.userId,         
        key:'Info' });
    user=JSON.parse(user);
    //判断是否为admin
    if(user.userName!=='admin'){
        //错误提示信息
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:params.msg
        });
        throw new Error(params.msg);
    }
    return user;
}
/*判断是否为Admin}}}*/

function localIP() {
/*获取本地IP{{{*/
    const os = require('os');
    const ifaces = os.networkInterfaces();
    let locatIp = '';
    for (let dev in ifaces) {
        for (let j = 0; j < ifaces[dev].length; j++) {
            if (ifaces[dev][j].family === 'IPv4' && 
                ifaces[dev][j].address!='127.0.0.1') {
                locatIp = ifaces[dev][j].address;
                break;
            }
        }
    }
    return locatIp;
}
/*获取本地IP}}}*/

