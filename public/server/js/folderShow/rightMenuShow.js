$(document).ready(function(){

    // 右键菜单显示
    addRigClickEvent($('main .showFilePanel'));

});

/* 右键菜单显示与隐藏 {{{
 * 调用参数 : 右键对象，空白处右键菜单，文件右键菜单*/
function addRigClickEvent(showFilePanel,fn){
    var that=this;
    //禁止浏览器默认右键事件
    $(document).unbind('mousedown')
        .bind('contextmenu',function(e){
        e.preventDefault();
        return false;
    });
    //注册右键事件
    $(showFilePanel).unbind('mousedown')
        .bind('mousedown',function(e){
        if(e.which == 3){
            //右键菜单
            if(e.target.tagName=='LI' || 
                e.target.parentNode.tagName=='LI'){
                //在文件上右键
                showrbm('file',true,e);
                window.targetElem=e.target
                return;
            }
            showrbm('all',true,e);
        }else if(e.which == 1){
            //左键隐藏右键菜单
            showrbm('all',false);
            showrbm('file',false);
        }
    });
}
/* 右键菜单显示与隐藏 }}}*/

/* 显示或隐藏右键菜单 {{{*/
function showrbm(actopt,showBool,e){
    var allrbm=$('main .allrbm'),
        filerbm=$('main .filerbm');

    switch(actopt){
        case 'all':
            if(showBool){ showAllrbm(e);
                }else{ hiddenAllrbm(); }
            break;
        case 'file':
            if(showBool){ showFilerbm(e);
                }else{ hiddenFilerbm(); }
            break;
    }

    function showAllrbm(e){ 
        allrbm.css({
            display:'block',
            left:e.clientX+'px',
            top:e.clientY+'px'
        });
        hiddenFilerbm();
    }
    function hiddenAllrbm(){ allrbm.css('display','none'); }
    function showFilerbm(e){ 
        filerbm.css({
            display:'block',
            left:e.clientX+'px',
            top:e.clientY+'px'
        });
        hiddenAllrbm();
    }
    function hiddenFilerbm(){ filerbm.css('display','none'); }
}
/* 显示或隐藏右键菜单 }}}*/

/* 显示重命名框 {{{*/
function showRenamePanel(targetElem,oldName){
    var renamediv=$('main .rename');
    renamediv.addClass('show');
    var renameWidthHalf = renamediv[0].offsetWidth/2;
    var renameLeft= targetElem.parentNode.offsetLeft +
                (targetElem.parentNode.offsetWidth/2) - renameWidthHalf;

    /* 重定位重命名框 {{{*/
    if(renameLeft<0){ 
        renamediv.find('.topArrow').css('margin-left','-116px');
        renameLeft=0;
    }
    var ulPanelWidth=targetElem.parentNode.parentNode.offsetWidth;
    var shiftLength=ulPanelWidth-(renameWidthHalf*2);
    if(shiftLength<renameLeft){
        var shiftLength=shiftLength-renameLeft;
        var topArrshift=
            parseInt(renamediv.find('.topArrow').css('margin-left'));
        renamediv.find('.topArrow').css('margin-left',topArrshift-shiftLength);
        renameLeft=renameLeft+shiftLength;
    }
    /* 重定位重命名框 }}}*/

    //重命名框常规定位
    var renameTop= targetElem.parentNode.offsetTop +
            targetElem.parentNode.offsetHeight;
    renamediv.css({
        left:renameLeft + 'px',
        top:renameTop + 'px'
    });
    return renamediv;
}
/* 显示重命名框 }}}*/
