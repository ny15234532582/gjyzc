$(document).ready(function(){

    //修改显示条数
    $('.tableFood .OnePagingNum').change(function(){ linkToPage(1); });
    //首页
    $('.paging .pagingfirstNum').on('click',function(){
        if(nowPage() == 1) return;
        linkToPage(1); });

    //上一页
    $('.paging .pagingprevNum').on('click',function(){
        var nowpagNum=nowPage();
        if(nowpagNum == 2){ return; }
        linkToPage(nowpagNum-2); });
        
    //下一页
    $('.paging .pagingnextNum').on('click',function(){
        var nowpagNum=nowPage();
        var lastpageNum=parseInt($('.paging .pagingNum:last').text());
        if((nowpagNum-1) == lastpageNum){ return; }
        linkToPage(nowpagNum); });

    //尾页
    $('.paging .paginglastNum').on('click',function(){
        var lastpageNum=parseInt($('.paging .pagingNum:last').text());
        if(nowPage() == lastpageNum) return;
        linkToPage(lastpageNum); });

    //点击页码进行跳转
    $('.paging .pagingNum').on('click',function(){ 
        if($(this).text()=='...') return;
        linkToPage($(this).text()); 
    });

    //输入页码进行跳转
    $('.paging .lastLi input').on('keypress',function(event){
        if(event.keyCode == '13'){
            var pagNum=$(this).val();
            if(pagNum<1 || 
                pagNum>$('.paging .pagingNum').length) return;
            linkToPage($(this).val()); } });
    
    //辅助方法---跳转到指定页码
    function linkToPage(pageNum,query){
        //当前单页条数
        if(!query) query={};
        query.onepageNum=pageListNum();
        //根据左上角头信息判断日志类型
        var logType='',
            titleElem=$('.tableHead>label').text()
        if(titleElem=='操作日志')
            logType='systemInfo';
        else if(titleElem=='错误日志')
            logType='systemError';

        $.get({
            url:'/manage/log/'+logType+'/'+pageNum,
            data:query,
            success:function(data){
                /*跳转到当前页码页面的初始化{{{*/
                var pagNum=
                    parseInt(this.url.split('/')[4])+2;
                $('main').html(data);

                //修改条数选择的默认条数
                $('.tableFood .OnePagingNum option')
                    .each(function(){
                    if(parseInt($(this).text())==
                        $('.tableFood .OnePagingNum')
                        .attr('defaultopt')){
                        $(this).attr('selected','selected');
                    }
                });

                //当前页码变色
                $('.paging .pagingNum').removeClass('active');
                getNowPagingElem(pagNum-2)
                    .addClass('active'); } }); }
                /*跳转到当前页码页面的初始化}}}*/

    //辅助方法---返回当前页
    function nowPage(){
        var allpage=$('.paging .pagingNum');
        for(var i=0;i<allpage.length;i++){
            if($(allpage[i]).hasClass('active')) 
                return parseInt($(allpage[i]).text())+1; } }

    //辅助方法---返回当前单页条数
    function pageListNum(){
        var onePagingNum=parseInt(
            $('.tableFood .OnePagingNum '+
                'option:selected').text());
        if(!onePagingNum) onePagingNum=10;
        return onePagingNum; }

    //辅助方法---返回当前页码元素
    function getNowPagingElem(pagNum){
        var elem='';
        $('.paging .pagingNum').each(function(item,index){
            if($(this).text()==pagNum)
                elem=$(this);
        });
        return elem;
    }

});
