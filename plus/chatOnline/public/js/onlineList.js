//第二次点击文档后关闭在线人员列表
$(document).click(function(){
    $('.onlineList').remove();
});

//注册点击用户时触发的聊天面板弹出事件
$('.onlineList li:not([class~="line"])')
    .unbind('click').click(function(event){
    $.get({
        url:'/manage/chatOnline/chatOnlinePage',
        data:{ userId:$(this).data('uid') },
        success:function(data){
            $('body').append(data);
        }
    });
});

