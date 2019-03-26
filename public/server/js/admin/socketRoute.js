define(['http://'+window.location.host+
    '/socket.io/socket.io.js'],function(io){
    var socket=null;

    //服务器传回的消息事件
    return {
        socketRoute:socketRoute,
    };

    function socketRoute(){
        /*监听服务器传送到客户端的消息{{{*/
        let socket=window.default_socket=io.connect('http://'+
            window.location.host+'/default',
            {'reconnect':true,
             'reconnection delay':1000});
        
        socket.on('serverMessage',function(msg){
            addNewMsg(msg.msg,msg.msgType); 
        });
        socket.on('connect',function(data){
            console.log('与服务器连接成功'); 
        });
        socket.on('disconnect',function(data){
            addNewMsg('与服务器失去联系，正在尝试与服务器建立连接','Error'); 
        });
        socket.on('reconnect',function(data){
            addNewMsg('与服务器重新建立连接成功','Info'); 
        });
        socket.on('logout',function(data){
            /*显示信息*/
            if(data==socket.id){
                alert('已被强制退出系统','Error');
                setTimeout(function(){
                    window.location.href="/manage/logout";
                },3000);
            }
        });

        //通知服务器socket路由注册
        socket.emit('plusCliInit');
        //服务器插件的客户端初始化
        socket.on('plusSerInit',function(allSockRoute){
            allSockRoute.forEach(function(item){
                $.getScript(item,function(){
                    console.log('插件的客户端初始化执行成功'
                        +item+'\n'+socket.id);
                });
            });
        });
    }
    /*监听服务器传送到客户端的消息}}}*/

});

function addNewMsg(msgText,msgType){
/*页面提示新的消息{{{*/
    var msgDiv=$('body>.message');
    var msgshowDuration=1000*4;
    var msgClass='open'+msgType;
    var oneMsg=$('<li style="transition:all .7s;">'+
        msgText+'</li>');
    msgDiv.append(oneMsg);
    //消息显示
    setTimeout(function(){
        oneMsg.addClass(msgClass);
        msgDiv.css('z-index','1000');
        setTimeout(function(){
            //消息关闭
            oneMsg.removeClass(msgClass);
            //删除消息
            oneMsg.on('transitionend',function(){
                oneMsg.remove(); 
                if(msgDiv.find('li').length==0) 
                    msgDiv.css('z-index','-1');
            });
        },msgshowDuration);
    },0);
}
/*页面提示新的消息}}}*/

