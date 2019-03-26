define(['publicTools','jquery'],function(publicTools){
    //头部菜单动作
    return topMenuRoute;

    function topMenuRoute(){
        let topMenuBtn=$('.topMenu>li');
        for(let i=0;i<topMenuBtn.length;i++){
            $(topMenuBtn[i]).unbind('click')
                .bind('click',function(event){
                var that=this;
                if('在线人员'==this.innerHTML){
                /*显示好友列表面板{{{*/
                    $.get({
                        url:'/manage/chatOnline',
                        success:function(data){
                            let onlineList=$(data);

                            /*清除旧的好友列表*/
                            let olClass=onlineList.attr('class');
                            $('.'+olClass).remove();

                            /*聊天面板定位*/
                            let mousePosi=getMousePos(event);
                            onlineList.css({
                                position:'fixed',
                                top:mousePosi.y+10,
                                left:mousePosi.x+10
                            });

                            $('body').append(onlineList);
                        }
                    });
                /*显示好友列表面板}}}*/
                } 
            });
        };
    }
    
});

function getMousePos(event) {
/*获取鼠标点击时的坐标{{{*/
    let e = event || window.event;
    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let x = e.pageX || e.clientX + scrollX;
    let y = e.pageY || e.clientY + scrollY;
    //alert('x: ' + x + '\ny: ' + y);
    return { 'x': x, 'y': y };
}
/*获取鼠标点击时的坐标}}}*/

