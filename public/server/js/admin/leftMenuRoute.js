define(['publicTools','jquery'],function(publicTools){

    //左侧一级菜单点击事件
    return leftMenuRoute;

    function leftMenuRoute(){
        /* 左侧一级菜单点击跳转 {{{*/
        var oneNavLabel=$('body>nav label');
        for(var i=0;i<oneNavLabel.length;i++){
            $(oneNavLabel[i]).unbind('click')
                .bind('click',function(){
                var that=this;

                //一级菜单导航
                if('站点信息'===this.innerHTML){
                    /*站点导航{{{*/
                    $.ajax({
                        url:'/manage/webinfo',
                        success:function(data){
                            toggleSubMenu(that);
                            $('main').html(data);
                        }
                    });
                    /*站点导航}}}*/
                }else if('栏目分类'===this.innerHTML){
                    /*栏目分类{{{*/
                    $.ajax({
                        url:'/manage/artfolder',
                        success:function(data){
                            clickOnloadNav(that,
                                '/manage/artfolderlow',
                                '/manage/artfolder');
                            $('main').html(data);
                        }
                    });
                    /*栏目分类}}}*/
                }else if('组织机构'===this.innerHTML){
                    toggleSubMenu(that);
                }else if('部门管理'===this.innerHTML){
                    /*部门管理{{{*/
                    $.get({
                        url:'/manage/department',
                        data:{path:escape('部门管理')},
                        success:function(data){
                            clickOnloadNav(that,
                                '/manage/lowDepartment','/manage/department');
                            $('main').html(data);
                        }
                    }); 
                    /*部门管理}}}*/
                }else if('用户管理'===this.innerHTML){
                    /*用户管理{{{*/
                    $.ajax({
                        url:'/manage/usermanage/1',
                        type:'GET',
                        success:function(data){
                            var pagNum=Number(this.url.split('/')[3])+2;
                            $('main').html(data);
                            $('.paging .pagingNum').removeClass('active');
                            $('.paging .pagingNum:nth-of-type('+pagNum+')').addClass('active'); 
                        }
                    });
                    /*用户管理}}}*/
                }else if('日志系统'===this.innerHTML){
                    toggleSubMenu(that);
                }else if('系统操作'===this.innerHTML){
                    /*系统操作日志{{{*/
                    $.get({
                        url:'/manage/log/systemInfo/1',
                        data:{},
                        success:function(data){
                            var pagNum=
                                parseInt(this.url.split('/')[4])+2;
                            $('main').html(data);
                            $('.paging .pagingNum').removeClass('active');
                            $('.paging .pagingNum:nth-of-type('+pagNum+')').addClass('active'); 
                        }
                    });
                    /*系统操作日志}}}*/
                }else if('系统错误'===this.innerHTML){
                    /*系统错误日志{{{*/
                    $.get({
                        url:'/manage/log/systemError/1',
                        data:{},
                        success:function(data){
                            var pagNum=
                                parseInt(this.url.split('/')[4])+2;
                            $('main').html(data);
                            $('.paging .pagingNum').removeClass('active');
                            $('.paging .pagingNum:nth-of-type('+pagNum+')').addClass('active'); 
                        }
                    });
                    /*系统错误日志}}}*/
                }
            });
        }
    }
    /* 左侧一级菜单点击跳转 }}}*/

    /*************辅助方法***********************/

    function clickOnloadNav(elem,urlparam,linkurl){
    /* 左侧菜单 点击标签=>根据服务器返回的数据刷新左侧菜单 {{{*/
    /********************************************
     *参数1：当前点击的label;
     *参数2：获取左侧树状菜单需要请求的服务器接口
     *参数2：获取右侧文件夹数据需要请求的服务器接
     ********************************************/

        //返回客户端目录树
        var browpath=publicTools.labelToPath(elem);
        //向服务器请求子目录
        $.get({
            url:urlparam,
            data:{ path:browpath.join('/') },
            success:function(data,status){
                if(data){
                    //动态填充子菜单HTML代码，并添加事件
                    leftnavinnerHtml(browpath,data,urlparam,linkurl);
                    //打开或关闭子菜单
                    toggleSubMenu(elem);
                }
            }
        });
    }
    /* 左侧菜单 点击标签=>根据服务器返回的数据刷新左侧菜单 }}}*/

    function leftnavinnerHtml(path,jsondata,urlparam,linkurl){
    /* 左侧菜单动态添加数据 {{{*/

        //限制显示的目录最多为四层
        if(path.length > 3 || !jsondata.lowFolder) return;

        //生成用于插入页面的html代码
        var domclassAry=['one','two','three','four'];
        var domclass=domclassAry[path.length]+'Level';
        var labelArry=jsondata.lowFolder;
        var innerHtml='';
        for(var i=0;i<labelArry.length;i++){
            innerHtml+=
                '<li>'+
                    '<label class="'+domclass+'">'+labelArry[i]+'</label>'+
                    '<ul></ul>'+
                '</li>';
        }

        //插入html代码的标签元素
        var dompath=pathToLabel(path);

        var labelsubMenu=dompath.next('ul');
        labelsubMenu.html(innerHtml);

        /* 给子菜单注册事件 {{{*/
        var subMenus=labelsubMenu.find('label');
        for(var i=0;i<subMenus.length;i++){
            publicTools.clidbType(subMenus[i],function(){
                //单击打开子菜单
                clickOnloadNav(this,urlparam,linkurl);
            },"all",function(){
                //双击在右侧打开当前菜单页面
                var that=this;
                $.ajax({
                    url:linkurl,
                    data:{
                        path:publicTools.revisedblclickPath(
                            path.join('/')+'/'+that.innerText)
                    },
                    success:function(data,status){
                        $('main').html(data);
                    }
                });
            });
        }
        /* 给子菜单注册事件 }}}*/

    }
    /* 左侧菜单动态添加数据 }}}*/

    function toggleSubMenu(elem){
    /* 左侧菜单 点击标签=>子菜单伸缩 {{{*/
        //子菜单为空,直接返回
        if($(elem).next('ul').find('li').length<=0) return;

        //关闭其他的子菜单
        var broElems=elem.getAttribute('class')
            .match(/oneLevel|twoLevel|threeLevel|fourLevel/);
        broElems=$(elem).closest('ul').find('.' + broElems);
        var broElemsIndex=-1,browSubNav;

        //复位
        for(var i=broElems.length-1;i>=0;i--){
            //获取子菜单
            var subNav=$(broElems[i]).next('ul');
            if(broElems[i].innerText==elem.innerText){
                broElemsIndex=i;
                browSubNav=subNav;
                continue;
            }
            //关闭子菜单
            publicTools.closeSubNav(subNav,33);
            broElems[i].classList.remove('open');
        }
        //打开当前菜单
        if(broElemsIndex>-1){
            //当前子菜单伸缩
            broElems[broElemsIndex].classList.toggle('open');
            if(broElems[broElemsIndex].classList.contains('open'))
                publicTools.openSubNav(browSubNav,33);
            else publicTools.closeSubNav(browSubNav,33);
        }
    }
    /* 左侧菜单 点击标签=>子菜单伸缩 }}}*/

});

