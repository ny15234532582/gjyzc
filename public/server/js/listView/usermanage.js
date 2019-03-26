$(document).ready(function(){
    
    //显示更多{{{
    $('.userList .showinfo').on('click',function(){
        //当前行数
        var userInfoElem=$('.content .userInfoLeft');
        if(userInfoElem.hasClass('open')){
            //关闭信息框
            userInfoElem.removeClass('open');
        }else{

            //打开信息框
            $.ajax({
                url:'/manage/userinfo/'+
                    $(this).closest('tr').find('td:nth-of-type(2)').text(),
                type:'GET',
                success:function(data){
                    var userconthtml=[
                     '<li>用户名：'+data.userName+'</li>',
                     '<li>姓名：'+data.name+'</li>',
                     '<li>电话：'+data.phone+'</li>',
                     '<li>邮箱：'+data.Email+'</li>',
                     '<li>地址：'+data.address+'</li>',
                     '<li>QQ：'+data.qq+'</li>',
                     '<li>微信：'+data.weixin+'</li>',
                     '<li>所属部门：'+data.departPath+'</li>',
                     '<li>当前职位：'+data.position+'</li>',
                     '<li>创建时间：'+data.createdAt+'</li>',
                     ].join('');
                    $('.userInfoLeft .cont').html(userconthtml);
                    userInfoElem.addClass('open');
                }
            });
        }
    });
    //显示更多}}}

    //获取新增用户界面{{{
    $('.btnGroup .add').on('click',function(){
        $.ajax({
            url:'/manage/adduser/null',
            type:'GET',
            success:function(data){
                $('body').append(data);
                $('.subpanel .subtrue')
                    .data('addnewuser','true');
            }
        });
    });
    //获取新增用户界面}}}

    //用户修改{{{
    $('.liBtnGroup .changeinfo').on('click',function(){
        $.ajax({
            url:'/manage/adduser/'+
                $(this).closest('tr').find('td:nth-of-type(2)').text(),
            type:'GET',
            success:function(data){
                $('body').append(data);
            }
        })   
    });
    //用户修改}}}

    /*分页操作{{{*/

    //修改显示条数
    $('.tableFood .OnePagingNum').change(function(){ linkToPage(1); });
    //首页
    $('.paging .pagingfirstNum').on('click',function(){
        if(nowPage() == 1) return;
        linkToPage(1); });

    //上一页
    $('.paging .pagingprevNum').on('click',function(){
        var nowpagNum=nowPage();
        if(nowpagNum == 1){ return; }
        linkToPage(nowpagNum-1); });
        
    //下一页
    $('.paging .pagingnextNum').on('click',function(){
        var nowpagNum=nowPage();
        if(nowpagNum == $('.paging .pagingNum').length){ return; }
        linkToPage(nowpagNum+1); });

    //尾页
    $('.paging .paginglastNum').on('click',function(){
        if(nowPage() == $('.paging .pagingNum').length) return;
        linkToPage($('.paging .pagingNum').length); });

    //点击页码进行跳转
    $('.paging .pagingNum').on('click',function(){ linkToPage($(this).text()); });

    //输入页码进行跳转
    $('.paging .lastLi input').on('keypress',function(event){
        if(event.keyCode == '13'){
            var pagNum=$(this).val();
            if(pagNum<1 || pagNum>$('.paging .pagingNum').length) return;
            linkToPage($(this).val()); } });
    
    //辅助方法---跳转到指定页码
    function linkToPage(pageNum,query){
        //当前单页条数
        if(!query) query={};
        query.onepageNum=pageListNum();
        $.ajax({
            url:'/manage/usermanage/'+pageNum,
            type:'GET',
            data:query,
            success:function(data){
                /*跳转到当前页码页面的初始化{{{*/
                var pagNum=parseInt(this.url.split('/')[3])+2;
                $('main').html(data);

                //修改条数选择的默认条数
                $('.tableFood .OnePagingNum option').each(function(){
                    if(parseInt($(this).text())==
                        $('.tableFood .OnePagingNum').attr('defaultopt')){
                        $(this).attr('selected','selected');
                    }
                });

                //当前页码变色
                $('.paging .pagingNum').removeClass('active');
                $('.paging .pagingNum:nth-of-type('+pagNum+')').addClass('active'); } }); }
                /*跳转到当前页码页面的初始化}}}*/

    //辅助方法---返回当前页
    function nowPage(){
        var allpage=$('.paging .pagingNum');
        for(var i=0;i<allpage.length;i++){
            if($(allpage[i]).hasClass('active')) return i+1; } }

    //辅助方法---返回当前单页条数
    function pageListNum(){
        var onePagingNum=parseInt(
            $('.tableFood .OnePagingNum option:selected') .text());
        if(!onePagingNum) onePagingNum=10;
        return onePagingNum; }

    /*分页操作}}}*/

    /*删除用户{{{*/
    $('.tableHead .removeUserBtn').on('click',function(){
        $.post({
            url:'/manage/removeuser',
            data:{
                userName:allSelectUser() },
            success:function(data){
                $('main').html(data); } });
    });
    
    //当前所有选中的用户
    function allSelectUser(){
        var selectName=[];
        $('.userList tbody input:checkbox:checked').each(function(){
            selectName.push($(this).parent().next('.userName').text());
        })
        return selectName.join(',');
    };
    /*删除用户}}}*/

    /*停用帐号{{{*/
    $('.tableHead .Enableright').on('click',function(){
        $.post({
            url:'/manage/disableuser',
            data:{
                userNames:allSelectUser()
            },success:function(){
                linkToPage(nowPage());
            } });
    });
    /*停用帐号}}}*/

    /*启用帐号{{{*/
    $('.tableHead .Enableleft').on('click',function(){
        $.post({
            url:'/manage/enableuser',
            data:{
                userNames:allSelectUser()
            },success:function(){
                linkToPage(nowPage());
            } });
    });
    /*启用帐号}}}*/

    /*重置密码{{{*/
    $('.tableHead .resetPass').on('click',function(){
        $.post({
            url:'/manage/resetpass',
            data:{
                userNames:allSelectUser()
            },success:function(){
                linkToPage(nowPage());
            } });
    });
    /*重置密码}}}*/

});

