$(document).ready(()=>{
    let socket=window.default_socket;
    //监听服务器传来的消息
    socket.on('chatOnlineSer',(params)=>{
        let onlineList=$('.onlineList');
        let nowChatPage=$('.chatOnlinePage .chatOnlineContent');

        /*如何在客户端显示提示消息{{{*/
        //当前聊天窗口为打开状态，则直接显示在面板中
        if(nowChatPage && params.userId==nowChatPage.data('uid')){
            if(params.userName=="我"){
                $('.chatOnlineShow').append('<li class="my">'+params.userName+' : '+params.msg+'</li>');
            }else{
                $('.chatOnlineShow').append('<li>'+params.userName+' : '+params.msg+'</li>');
            }
            //滚动到底层
            var scrollHeight = 
                $('.chatOnlineShow').prop("scrollHeight")+500;
            $('.chatOnlineShow').animate(
                {scrollTop:scrollHeight},1);
        }else{
            //将消息提示显示在头部菜单
            $('.topMenu li').each(function(){
                if($(this).html()=='在线人员'){
                    $(this).css('color','red');
                }
                $(this).one('click',function(){
                    $(this).css('color','');
                });
            });
            //将消息提示显示在用户列表
            onlineList.find('li').each(function(){
                if($(this).data('uid')==params.userId){
                    $(this).css('color','red');
                    //上移到第一位
                    onlineList.find('li').eq(0).before($(this));
                    return false;
                }
            });
        }
        /*如何在客户端显示提示消息}}}*/

    });
});
