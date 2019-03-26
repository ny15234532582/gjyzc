$(document).ready(function(){
    // 富文本编辑器初始化
    var ue=UE.getEditor('myEditor');

    /* 按钮滚动定位 {{{*/
    var arteditform=document.querySelector('.article_edit_panel form');
    var subpanel=arteditform.querySelector('.subpanel');
    var subbtnbottom=20;
    //按钮复位时间
    var scrolltime=200,
        canRun=true;
    if(arteditform){
        arteditform.addEventListener('scroll',function(e){
            if(!canRun){ return; }
            canRun = false;
            setTimeout(function(){
                //矫正位置
                subpanel.style.bottom=
                    subbtnbottom-parseInt(arteditform.scrollTop)+'px';
                canRun=true; 
            },scrolltime);
        });
    }
    /* 按钮滚动定位 }}}*/

    /* 输入框初始化 {{{*/
    //设置更改前的文章标题
    var oldTitleText=targetElem ? 
        $(targetElem.parentNode).find('span').text() : '';
    var oldTitle= $('<input name="oldTitle"></input>')
        .css('display','none')
        .val(oldTitleText);
    $('.article_edit_panel form').append(oldTitle);
    //设置文本编辑框
    UE.getEditor('myEditor').ready(function(){
        UE.getEditor('myEditor').setContent($('#nrbjLabel').attr('contentHtml'));
    });
    /* 输入框初始化 }}}*/
    
    /* 编辑框动作汇总 {{{*/

    //关闭编辑框
    $('.subpanel .subfalse').one('click',function(event){
        event.preventDefault(); 
        $('.article_edit_panel').remove(); });

    //提交数据
    $('.subpanel .subtrue').one('click',function(event){
        var options = {
            data:{ 'editorContain':ue.getContent() },//编辑框内的HTML
            //服务器返回结果处理
            success:function(data){
                $('.article_edit_panel').remove();
                redirect(data); } }

        //提交表单
         $(".article_edit_panel form").ajaxSubmit(options);
         return false; });//阻止页面跳转
    /* 编辑框动作汇总 }}}*/

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

    /* 文件上传 文件名显示在上一个input元素中。{{{*/
    var upfilebtn=$('.upfile input[type="file"]');
    if(upfilebtn){
        upfilebtn.on('change',function(){
            //取不带路径的文件名
            var fileName=this.value.split('\\');
            fileName=fileName[fileName.length-1];
            $(this.parentNode).prev().val(fileName);
            //预览图片
            var files = this.files;
            if(files.length<1){
                return;
            }
            //把上传的图片显示出来 
            var file=files[0];
            var reader=new FileReader();
            reader.readAsBinaryString(file);
            reader.onload=function(f){
                var result=document.querySelector('form .showImg');
                var src='data:'+file.type+';base64,'+window.btoa(this.result);
                result.setAttribute("src",src);
            }
        });
    }
    /* 文件上传 文件名显示在上一个input元素中。}}}*/

});
