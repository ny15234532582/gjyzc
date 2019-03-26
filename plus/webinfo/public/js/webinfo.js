$(document).ready(function(){

    /* 站点信息 文件上传 文件名显示在上一个input元素中。{{{*/
    var upfilebtn=$('.upfile input[type="file"]');
    if(upfilebtn){
        upfilebtn.one('change',function(){
            //取不带路径的文件名
            var fileName=this.value.split('\\');
            fileName=fileName[fileName.length-1];
            $(this.parentNode).prev().val(fileName);
        });
    }
    /* 站点信息 文件上传 文件名显示在上一个input元素中。}}}*/

});
