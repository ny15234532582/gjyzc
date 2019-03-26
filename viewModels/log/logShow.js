const path=require('path');
const moment=require('moment');
const logDataSec=require(dirlist.dataSecPath+'log');

module.exports=function(req,res,next){

    if(req.xhr){

        /*初始化参数{{{*/
        let params={ 
            layout:null,
            //单页条数
            onepageNum:Number(req.query.onepageNum) || 10,
            //当前页码
            nowNum:(()=>{ 
                let nowNum;
                if(!req.params.pageNum ||
                    req.params.pageNum=='null') nowNum=1;
                else nowNum=req.params.pageNum;
                return parseInt(nowNum); 
            })(),
            //日志类型
            nowLogType:(()=>{
                let nowLogType='';
                if(req.params.logType=='systemInfo')
                    nowLogType='info';
                else if(req.params.logType=='systemError')
                    nowLogType='error';
                return nowLogType;
            })(),
            //页面标题
            title:(()=>{
                let title='';
                if(req.params.logType=='systemInfo')
                    title='操作日志';
                else if(req.params.logType=='systemError')
                    title='错误日志';
                return title;
            })(),
        }
        /*初始化参数}}}*/

        //当前日志起始条数
        let startpage=(params.nowNum-1)*params.onepageNum;
        clientParams({
            userId:req.session.userId,
            type:params.nowLogType, 
            start:startpage,
            end:startpage+params.onepageNum, 
            onepageNum:params.onepageNum})
        .then((params1)=>{
            let allParams=Object.assign(params,params1);
            return res.render('listShow',allParams);
        }); 
    }
}

async function clientParams(params){
/*需要传给客户端的数据{{{*/
    //从缓存中查找操作日志 
    let data=await logDataSec.findSystemInfo(params);

    //日志总数
    params.allNumber=data.allNum;

    //分页数组
    let pageNum=Math.ceil(
        params.allNumber/params.onepageNum);
    params.pageAry=pageNumberAry(pageNum,params.nowNum);

    //每一行进行数据规整
    params.allRow=[];
    data.logLists.forEach((item,index)=>{
        //获取时间
        let allDate=item.match(/^\s??\[[\d-\s:]*(?=\])/)[0];
        let date=allDate.replace(/(^\s*)\[+/ig,'');
        params.allRow.push({
            firstcol:date,
            colType:[item.slice(allDate.length+1)]
        }); 
    }); 
    //页面固定数据
    pageBaseData(params);

    return params;
}
/*需要传给客户端的数据}}}*/

function pageBaseData(params){
/*页面固定的数据{{{*/
    //客户端动作列表
    params.clientAction='systemInfoLog';
    //搜索条件
    params.searchCondition=[
        {label:'关键字',inputType:'text'},
        {label:'开始时间',inputType:'date'},
        {label:'结束时间',inputType:'date'} ];
    //表格头部
    clientParams.tableTitle=[
        '时间','信息']; 
}
/*页面固定的数据}}}*/

function pageNumberAry(pageNum,nowNum){
    /*页码规整为数组,总页码和当前页码{{{*/
    let pageAry=[];
    for(let i=1;i<=pageNum;i++){
        //当分页数量超过15个，进行分页
        if(pageNum>10){
            //当前页小于等于10时，
            //第12个为省略号
            //大于等于12的，小于等于总数减3个，省略
            if(nowNum<=5){
                if(i==7) pageAry.push('...');
                if(i>=7 && i<=(pageNum-3))
                    continue;
                pageAry.push(i);
            }
            //当前页大于等于11，小于等于总数-15时，
            //当前页后面的第2个为省略号
            //大于等于当前页后面两个，小于等于总数减3个，省略，
            //小于等于当前页减10的，省略
            if(nowNum>5 && nowNum<=(pageNum-10)){
                if(i==(nowNum+2)) pageAry.push('...');
                if((i>=(nowNum+2) && i<=(pageNum-3))||
                    i<=(nowNum-5))
                    continue;
                pageAry.push(i);
            }
            //当前页为最后15个时
            //没有省略号
            //小于总数减15的，省略
            if(nowNum>(pageNum-10)){
                if(i<(pageNum-10)) continue;
                pageAry.push(i);
            }
        }else pageAry.push(i);
    }
    return pageAry; 
}
/*页码规整为数组}}}*/

