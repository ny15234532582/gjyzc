$(document).ready(function() {
    /*banner图*/
    $('.box_skitter_large').skitter({
        theme: 'clean',
        numbers:false,
        navigation:false,
        hideTools:true,
        progressbar: true, 
        preview: true,
        stop_over:false,
    });
    /*项目案例的横向滚动*/
    $('.scroll').scroll({
        speed: 80, //数值越大，速度越快
        direction: 'horizantal'
    });
    /*头部菜单动态出现*/
    $('header nav.close').click(function(event){
        /*删除Nav菜单*/
        $('header').css('padding','0');
        $('header nav')
            .removeClass('close').addClass('open');
        /*禁止冒泡*/
        event.stopPropagation();
        /*关闭菜单*/
        $('body').click(function(){
            $('header').css('padding','');
            $('header nav')
                .removeClass('open').addClass('close');
        });
    });
    /*分页数据*/

});
