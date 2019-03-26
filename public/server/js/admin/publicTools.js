define([],function(){
    return {
        //注册单击和双击事件
        clidbType:clidbType,
        //打开子菜单
        openSubNav:openSubNav,
        //关闭子菜单
        closeSubNav:closeSubNav,
        //修正左侧菜单双击时的地址，截取掉组织机构
        revisedblclickPath:revisedblclickPath,
        //左侧菜单 客户端根据标签返回目录树[数组]
        labelToPath:labelToPath,
        //左侧菜单 客户端根据目录树[数组]返回标签
        pathToLabel:pathToLabel,
    };
});

function clidbType(elem,fn,clitype,dblfn){
/* 单击和双击事件注册,默认为单击 {{{*/
/*参数，
 *  elem:HTML元素，
 *  fn:触发事件，
 *  clitype:单击还是双击，
 *  如果clitype为all，则fn为单击事件，dblfn为双击事件*/
    var timer=null;

    if(clitype=="click"){
        //单击事件
        elem.addEventListener('click',function(){
            var that=this;
            clearTimeout(timer);
            timer=setTimeout(function(){
                fn.apply(that,arguments);
            },250);
        });
    }else if(clitype=="dblclick"){
        //双击事件
        elem.addEventListener('dblclick',function(){
            clearTimeout(timer);
            fn.apply(this,arguments);
        });
    }else if(clitype=="all"){
        //单击+双击事件
        elem.addEventListener('click',function(){
            var that=this;
            clearTimeout(timer);
            timer=setTimeout(function(){
                fn.apply(that,arguments);
            },250);
        });
        elem.addEventListener('dblclick',function(){
            clearTimeout(timer);
            dblfn.apply(this,arguments);
        });
    }
}
/* 单击和双击事件注册,默认为单击，第三个参数为false，则为双击 }}}*/

function openSubNav(subNav,subNavOneHeight,oneliHeigh){
/* 打开子菜单 {{{*/
/*参数，subNav:当前菜单UL，
 *      subNavOneHeight:一个li的高度，
 *      oneliHeight:当前菜单高度，用于遍历*/
    //如果子菜单为空，则退出
    var allsubNav=subNav.children('li');
    var subNavNum=0;
    if(allsubNav.length<=0){ return; }

    //子菜单高度
    subNavNum=allsubNav.length;
    oneliHeigh=oneliHeigh || 0;
    oneliHeigh=oneliHeigh+(subNavNum*subNavOneHeight);

    //设定当前菜单的高度
    subNav.css('height',oneliHeigh);

    //父菜单高度增加子菜单的高度
    var pareUl=subNav.parent().closest('ul');

    //如果到顶了，就退出
    if(pareUl.prev('label').innerText=='控制面板') return;

    //循环
    openSubNav(pareUl,subNavOneHeight,oneliHeigh);

}
/* 打开子菜单 }}}*/

function closeSubNav(subNav,subNavOneHeight,oneliHeigh){
/* 关闭子菜单 {{{*/
/*******************************************
 * 参数,subNav:当前菜单UL，
 *      subNavOneHeight:一个li的高度，
 *      oneliHeight:当前菜单高度，用于遍历
 *******************************************/
    //子元素为空
    var allsubNav=subNav.find('li');
    if(allsubNav.length<=0){ return; }

    //设定当前菜单的高度,当首次遍历时
    if(!oneliHeigh){ 
        oneliHeigh=subNav.height();
        subNav.css('height', 
            parseInt(subNav.css('height'))-oneliHeigh);
        //关闭所有子菜单
        subNav.find('open').each(function(item,index){
            $(this).removeClass('open');
            $(this).next('ul').css('height',0);
        });
    }else{
        subNav.css('height', 
            parseInt(subNav.css('height'))-oneliHeigh);
    }

    var pareUl=subNav.parent().closest('ul');
    if(pareUl.prev('label').innerText=='控制面板'){
        return;
    };
    closeSubNav(pareUl,subNavOneHeight,oneliHeigh);
}
/* 关闭子菜单 }}}*/

function revisedblclickPath(path){
/*修正左侧菜单双击时的地址，截取掉组织机构{{{*/
    path=path.split('/');
    var index=path.indexOf('组织机构');
    index>-1 && path.splice(index,1);
    return path.join('/');
}
/*修正左侧菜单双击时的地址，截取掉组织机构}}}*/

function labelToPath(elem){
/*左侧菜单 客户端根据标签返回目录树[数组] {{{*/
    var parent=elem.parentNode,
        path=[elem.innerText];
    while(true){
        if(parent.tagName=='UL'){
            var label=$(parent).prev()[0];
            if(label.innerText=='控制面板'){
                break;
            }else{
                path.push(label.innerText);
            }
        }
        parent=parent.parentNode;
    }
    return path.reverse();
}
/*左侧菜单 客户端根据标签返回目录树[数组] }}}*/

function pathToLabel(path){
/*左侧菜单 客户端根据目录树[数组]返回标签 {{{*/
    var domclassAry=['one','two','three','four'];

    var labelElem=$('nav>label:nth-of-type(1)');
    for(var i=0;i<path.length;i++){
        labelElem.next('ul')
            .find('.'+domclassAry[i]+'Level').each(function(){
                if($(this).text()==path[i]){
                    labelElem=$(this);
                    return false;
                }
            });
    }
    return labelElem;
}
/*左侧菜单 客户端根据目录树[数组]返回标签 }}}*/

