$(document).ready(function(){

    /* 空白处右键菜单操作 {{{*/
    var openallrbm=$('.allrbm li:not([class~="line"])');
    openallrbm.each(function(){
        $(this).on('click',function(){
            showrbm('all',false);
            var clickText=this.innerText;
            switch(clickText){
                /* 路由 {{{ */
                case '新建部门':
                    /*新建部门{{{*/
                    $.post({
                        url:'/manage/adddepartment',
                        data:{ 
                            departPath:escape(getNowPath())},
                        success:function(data){
                            redirect(data);
                        }
                    });
                    break;
                    /*新建部门}}}*/
                case '新建职位':
                    /*新建职位{{{*/
                    $.post({
                        url:'/manage/addposition',
                        data:{ 
                            departPath:escape(getNowPath())},
                        success:function(data){
                            redirect(data);
                        }
                    });
                    break;
                    /*新建职位}}}*/
                case '全选':
                    console.log('1a');
                    break;
                case '属性':
                    console.log('1a');
                    break;
                default:
                    console.log('右键菜单出现未匹配现象'+clickText);
                /* 路由 }}} */
            }
        });
    });
    /* 空白处右键菜单操作 }}}*/

    /* 文件上右键菜单操作{{{*/
    var openfile=$('.filerbm li:not([class~="line"])');
    openfile.each(function(){
        $(this).one('click',function(){
            rigMenActList.call(this);
        });
    });
    function rigMenActList(){
        //关闭当前右键菜单
        showrbm('file',false);
        var targetElem=window.targetElem;

        //目标文件类型
        var filetype='';
        if($(targetElem.parentNode).hasClass('file')){
            filetype='file';
        }else if($(targetElem.parentNode).hasClass('folder')){
            filetype='folder';
        }

        //动作列表
        switch(this.innerText){
            case '打开':
                /* 打开文件 {{{*/
                if(filetype=='file'){
                    $.post({
                        url:'/openArtFile',
                        data:{
                            filename:$(targetElem.parentNode).
                                find('span').text(),
                        },
                        success:function(data){
                            $('body').append(data);
                        }
                    });
                }else if(filetype=='folder'){
                    $.get({
                        url:'/manage/department',
                        data:{
                            path:escape(getNowPath()+'/'+folderName(targetElem))
                        },success:function(data){
                            $('main').html(data);
                        }
                    }); 
                }
                break;
                /* 打开文件 }}}*/
            case '删除':
                /* 删除文件 {{{*/
                if(filetype=='file'){
                    $.post({
                        url:'/manage/removeposition',
                        data:{
                            departPath:escape(getNowPath()),
                            positionName:folderName(targetElem)
                        },
                        success:function(data){
                            redirect(data);
                        }
                    });
                }else if(filetype=='folder'){
                    //删除部门
                    $.post({
                        url:'/manage/removedepartment',
                        data:{
                            departPath:escape(getNowPath()),
                            departName:folderName(targetElem)
                        },
                        success:function(data){
                            redirect(data);
                        }
                    });
                }
                break;
                /* 删除文件 }}}*/
            case '重命名':
                /* 重命名文件 {{{*/
                var oldName=$(targetElem).next().text();//更改前的文夹名
                //显示重命名面板
                var renamediv=showRenamePanel(targetElem,oldName);
                var renameInput=renamediv.find('input:nth-of-type(1)');
                renameInput.val(oldName);
                //提交重命名操作
                renamediv.find('input[type="submit"]').one('click',function(){
                    renameAjax({
                        filetype:filetype,
                        actionPath:escape(getNowPath()+'/'+folderName(targetElem)),
                        newName:renameInput.val()
                    });
                    renamediv.removeClass('show');
                });
                break;
                /* 重命名文件 }}}*/
            case '属性':
                /* 属性 {{{*/
                if(filetype=='file'){
                }else if(filetype=='folder'){
                    $.get({
                        url:'/artfolderProperty',
                        data:{
                            filename:$(targetElem.parentNode).
                                find('span').text(),
                        },
                        success:function(data){
                            console.log('打开属性');
                            $('body').append(data);
                        }
                    });
                }
                break;
                /* 属性 }}}*/
        }

        /*部门和角色重命名{{{*/
        function renameAjax(param){
            if(param.filetype=='file')
                $.post({
                    url:'/manage/renameposition',
                    data:{
                        path:param.actionPath,
                        nowName:param.newName },
                    success:function(data){
                        redirect(data); } });
            else if(param.filetype=='folder')
                $.post({
                    url:'/manage/renamedepartment',
                    data:{
                        path:param.actionPath,
                        nowName:param.newName },
                    success:function(data){
                        redirect(data); } }); }
        /*部门和角色重命名}}}*/

    }; 
    /* 文件上右键菜单操作}}}*/

    /* 面包屑导航 {{{*/
    var crumbNav=$('main .crumbSubNav');
    var crumbAry=[];
    crumbNav.each(function(index){
        $(this).attr('crumbIndex',index+1);
        crumbAry.push($(this).text());
        //注册面包屑点击事件
        $(this).one('click',function(){
            redirect({
                status:true,
                newPath:escape( crumbAry.slice(0,
                        $(this).attr('crumbIndex')).join('/')),
                redirectUrl:'/manage/department' })

        });
    });
    /* 面包屑导航 }}}*/

    /*返回当前目录树 {{{*/
    function getNowPath(){
        var crumbNav=$('.crumbNav .crumbSubNav');
        var nowpath=[];
        for(var i=0;i<crumbNav.length;i++){
            nowpath.push(crumbNav[i].innerText);
        }
        return nowpath.join('/');
    }
    /*返回当前目录树 }}}*/
    
    /*当前文件名{{{*/
    function folderName(target){
        return $(target).next().text();
    }
    /*当前文件名}}}*/

    /*跳转到另一路径{{{*/
    function redirect(data){
        data.status && $.get({
            url:data.redirectUrl,
            data:{path:data.newPath},
            success:function(data1){
                $('main').html(data1);
            }
        }); 
    }
    /*跳转到另一路径}}}*/

});
