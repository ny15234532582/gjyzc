$(document).ready(function(){

    /*鼠标移到用户列表，显示操作按钮组{{{*/
    $('.userList tbody tr').hover(function(){
        $(this).find('.liBtnGroup .iconfont')
            .css('display','inline-block');
    },function(){
        $(this).find('.liBtnGroup .iconfont')
            .css('display','none');
    });
    /*鼠标移到用户列表，显示操作按钮组}}}*/

    /*选中当前页面所有用户{{{*/
    $('.userList thead input:checkbox').on('change',function(){
        if($(this).prop('checked')){
            $('.userList tbody input:checkbox').prop('checked',true);
        }else{
            $('.userList tbody input:checkbox').prop('checked',false);
        }
    })
    /*选中当前页面所有用户}}}*/
    
});
