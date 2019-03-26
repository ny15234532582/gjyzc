$(document).ready(function(){

    //自定义下拉框
    var selectList=$('.selectList');
    var selectInput=selectList.find('input');
    selectInput.next('ul').find('li').on('click',function(){
        $(this).parent().prev('input').val(this.innerText);
        var that=$(this).parent().css('height',0);
        setTimeout(function(){
            that.css('height','');
        },100);
        //选择角色下拉框获取权限
        $.get({
            url:'/manage/artauthpostget',
            data:{
                posiName:this.innerText,
                nowfolder:$($('.switchPanel input')[0]).val()},
            success:function(data){
                var auth='b';
                if(data.status) auth=data.auth;
                switch(auth){
                    case 'a': auth=0; break;
                    case 'd': auth=3; break;
                    case 'c': auth=2; break;
                    default: auth=1; }
                radiusAuth[auth].trigger('click'); } }); });

    //单选框
    var foldderauth=$('.folderauth');
    var radiusAuth=[$('input[name=accessBarred]'),
                $('input[name=viewArt]'),
                $('input[name=createOrDelete]'),
                $('input[name=examineAndVerify]')];
    
    for(var i=0;i<radiusAuth.length;i++){
        radiusAuth[i].on('click',function(){
            for(var i=0;i<radiusAuth.length;i++){
                if(radiusAuth[i].is($(this))){
                    radiusAuth[i].val('√');
                    radiusAuth[i].css({
                        'background':'rgb(235,235,228)',
                        'border-style':'groove' });
                    continue; }
                radiusAuth[i].val('');
                radiusAuth[i].css('background','#fff'); } });
    };

    //关闭按钮
    var closePropertybtn=$('.subfalse');
    closePropertybtn.one('click',function(){
        $('.article_edit_panel').remove(); });
    //提交按钮
    var submitPropertybtn=$('.subtrue');
    submitPropertybtn.one('click',function(){
        var auth=-1;
        for(var i=0;i<radiusAuth.length;i++){
            if(radiusAuth[i].val()=='√') auth=i;
        }

        switch(auth){
            case 0: auth='a'; break;
            case 3: auth='d'; break;
            case 2: auth='c'; break;
            default: auth='b'; }

        $.post({
            url:'/manage/artauthchange',
            data:{ posiName:
                    $('.selectList input[name=userGroup]').val(),
                nowfolder:$($('.switchPanel input')[0]).val(),
                auth:auth},
            success:function(data){
                console.log(data); 
            } 
        });

        $('.article_edit_panel').remove(); });

});
