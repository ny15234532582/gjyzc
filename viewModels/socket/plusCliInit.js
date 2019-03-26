const fs=require('fs');

module.exports=function(socket){
//客户端socket路由初始化
    return (data)=>{
        let allSockRoute=[];
        tools.allPlus()
        .then((allPlus)=>{
            for(let plus in allPlus){
                //客户端初始化的js文件路径数组发送到客户端
                //客户端将在每次socket重连的时候进行初始化
                //默认为插件中的public/js/clientInit.js文件
                let cliInit='/plus/'+plus+
                    '/js/clientInit.js';
                fs.existsSync(dirlist.plusPath+plus+
                    '/public/js/clientInit.js') &&
                    allSockRoute.push(cliInit);
                //服务器socket路由初始化
                //默认为插件中的routes/socketRoute.js文件
                let serSocRoute=
                    dirlist.plusPath+plus+
                    '/routes/socketRoute.js';
                fs.existsSync(serSocRoute) &&
                require(dirlist.plusPath+plus+
                    '/routes/socketRoute')(socket);
            }
            socket.emit('plusSerInit',allSockRoute);
        });
    }
}
