define(['jquery'],function(){
    return {
        //首次提交，返回提示信息
        first_log_msg:first_log_msg,
        //表单提交
        sub_form:sub_form,
        //回车键触发表单提交
        enter_sub_form:enter_sub_form,
    }
});

function enter_sub_form(){
/*回车键触发表单提交{{{*/
    $(document).keyup(function(event){
        if(event.keyCode==13){
            $('.loginSub').trigger('click');
        }
    });
}
/*回车键触发表单提交}}}*/

function first_log_msg(){
/* 如果为首次提交，则返回提示信息{{{*/
    $('input[name=user]').blur(function(){
        $.post({
            url:'/manage/firstLoginBool',
            data:{userName:$(this).val()},
            success:function(data){
                //首次登陆
                if(data.status && data.isUserFirstLogin)
                    first_log_show_msg();
            }
        }) 
    });
}

//第一次登陆提示信息
function first_log_show_msg(){
    $('.loginmsg').html('<span '+
        'style="color:#fff;font-weight:bold;'+
        'font-size:13px;">'+
        '系统检测您是第一次登陆系统,'+
        '请您输入初始密码，'+
        '此密码将用于您以后登陆系统，请慎重'+
        '</span>'); 
}
/* 如果为首次提交，则返回提示信息}}}*/

function sub_form(){
/*表单提交{{{*/
    $('.loginSub').on('click',function(){
        $.post({
            url:'/manage',
            data:{
                userName:$('input[name=user]').val(),
                password:$('input[name=password]').val() },
            success:function(data){
                $('.loginmsg').html(data.msg);
                //登陆成功
                if(data.status){
                    //socket登陆
                    setTimeout(function(){
                        location.href='/manage/admin';
                    },800); 
                }
            } 
        }); 
    });
}
/*表单提交}}}*/

