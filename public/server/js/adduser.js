$(document).ready(function(){

    //选择所属角色{{{
    $('.addUserBox .roleSelect').focus(function(){
        /*选择角色{{{*/
        $('.posiSelect li').one('click',function(){
            //点击角色后将选择自动填入Input框
            var posiPath=
                $(this).parent('ul').prev().text()+'/'+$(this).text();
            $('.addUserBox input[name="belongToRole"]').val(posiPath);
            //隐藏角色列表
            $('.addUserBox').parent().addClass('addUserContent');
            $('.addUserBox').parent().removeClass('addUserContent-role');
        });
        /*选择角色}}}*/
        $('.addUserBox').css('transition','.5s width');
        $('.addUserBox').parent().removeClass('addUserContent');
        $('.addUserBox').parent().addClass('addUserContent-role');
    });
    //选择所属角色}}}

    //关闭用户信息{{{
    $('.subpanel .subfalse').one('click',function(){
        $('.addUserPanel').remove();
    });
    //关闭用户信息}}}

    //新增或修改用户提交{{{
    $('.subpanel .subtrue').one('click',function(){
        var pagNumAry= $('.paging .pagingNum');
        var nowPagIndex=1;
        for(var i=0;i<pagNumAry.length;i++){
            if($(pagNumAry[i]).hasClass('active')){
                nowPagIndex=i;
            }
        }

        if($(this).data('addnewuser')){
            linkToPaging(pagNumAry.length-1);
        }else{
            linkToPaging(nowPagIndex);
        }
    });

    //用户修改提交
    function linkToPaging(pagNum){
        $.ajax({
            url:'/manage/adduser/'+$('input[name=userName]').val(),
            type:'POST', 
            data:{
                userName:$('input[name=userName]').val(),
                name:$('input[name=name]').val(),
                phone:$('input[name=phone]').val(),
                Email:$('input[name=Email]').val(),
                address:$('input[name=address]').val(),
                qq:$('input[name=qq]').val(),
                weixin:$('input[name=weixin]').val(),
                belongToRole:$('input[name=belongToRole]').val(),
                pageNum:pagNum+1 },
            success:function(data){
                $('.addUserPanel').remove();
                $('main').html(data);
                $($('.paging .pagingNum')[pagNum]).addClass('active');
            } }); }
    //新增或修改用户提交}}}

});
