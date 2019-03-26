//关闭聊天界面
$('.subpanel .subfalse').click(function(){
    $('.chatOnlinePage').remove(); 
});

//发送信息
$('.subpanel .subtrue')
    .unbind('click').click(function(){
    //监听服务器传来的信息
    let socket=window.default_socket;
    let sendTouid=$('.chatOnlineContent').data('uid');

    //发送消息
    socket.emit('chatOnlineCli',{
        nowsid:socket.id,
        userName:$('.userName').text().slice('你好，'.length),
        userPosi:$('.userposi').text(),
        userId:sendTouid,
        msg:$('.chatOnlineSend textarea').val()
    });
});

