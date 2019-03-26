const artfileDao=
    require(dirlist.plusPath+'cms/dao/artfile');
const moment=require('moment');

module.exports={
    //首页数据
    indexData:indexData,
    //详情页数据
    detailData:detailData,
    //列表页数据
    listData:listData,
    //客户端留言
    leaveMsg:leaveMsg,
    //保存客户端留言
    addleaveMsg:addleaveMsg,
}

async function indexData(){
/*首页数据{{{*/
    let data={};
    try{
        //公司简介
        data.aboutUs1={}; 
        (await artfileDao
            .findArticle({path:"栏目分类/公司简介"}))
            .forEach((item,index)=>{ if(index==0){
                data.aboutUs1.title=item.title;
                data.aboutUs1.text=item.ArtContent;
            }
        });
        data.aboutUs2=[];
        (await artfileDao
            .findArticle({path:"栏目分类/公司简介/首页2"}))
            .forEach((item,index)=>{
            if(index>2) return false;
            data.aboutUs2.push({
                icon:item.titleImg,
                title:item.title,
                summary:item.summary
            });
        });
        (await artfileDao
            .findArticle({path:"栏目分类/公司简介/首页3"}))
            .forEach((item,index)=>{
            if(index>0) return false;
            data.aboutUs3=item.titleImg;
        });
        //产品中心
        data.ourProject=[];
        (await artfileDao
            .findArticle({path:"栏目分类/产品中心"}))
            .forEach((item,index)=>{
            if(index>6) return false;
            let summary=item.summary.length>18 ?
                item.summary.slice(0,18)+'...' : item.summary;
            data.ourProject.push({
                title:item.title, 
                summary:summary,
                img:item.titleImg,
                url:'/detail?artId='+item._id
            });
        });
        //项目案例
        data.projectDemo=[];
        (await artfileDao
            .findArticle({path:"栏目分类/项目案例"}))
            .forEach((item,index)=>{
            data.projectDemo.push({
                summary:item.summary,
                img:item.titleImg,
                url:'/detail?artId='+item._id
            });
        });
        
        //公共数据
        await layoutData(data);
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            msg:'查找首页数据失败\n'+err.stack
        });
    }
    return data;
}
/*首页数据}}}*/

function randomNum(minNum,maxNum){ 
/*生成从minNum到maxNum的随机数{{{*/
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
        break; 
    } 
}
/*生成从minNum到maxNum的随机数}}}*/

async function detailData(params){
/*详情页数据{{{*/
    let data={};
    try{
        //文章详情
        data={};
        //如果为目录则显示第一篇文章
        if(params.path){
            (await artfileDao
                .findArticle({path:params.path}))
                .forEach((item,index)=>{
                if(index>1) return false;
                let crum=item.path.split('/');
                crum=crum.slice(1,crum.length);

                let formatDate=moment(item.created_at);
                let date=formatDate.format('YYYY-MM-DD');
                data={
                    title:item.title,
                    summary:item.summary,
                    artContent:item.ArtContent,
                    crum:crum,
                    date:date,
                };
            });
        }else if(params.artId){
            (await artfileDao
                .findArticle({_id:params.artId}))
                .forEach((item,index)=>{
                let crum=item.path.split('/');
                crum=crum.slice(1,crum.length);
                let formatDate=moment(item.created_at);
                let date=formatDate.format('YYYY-MM-DD');

                data={
                    title:item.title,
                    summary:item.summary,
                    artContent:item.ArtContent,
                    crum:crum,
                    date:date,
                };
            });
        }
        //左侧菜单第一项
        data.listTitle=data.crum[data.crum.length-1];
        //公共数据
        await layoutData(data);
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            msg:'查找首页数据失败\n'+err.stack
        });
    }
    return data;
}
/*首页数据}}}*/

async function listData(params){
/*列表页数据{{{*/
    let data={};
    try{
        //面包屑
        let crum=params.path.split('/');
        data.crum=crum.slice(1,crum.length);
        //左侧菜单第一项
        data.listTitle=data.crum[data.crum.length-1];
        //列表
        data.allTitle=[];
        (await artfileDao
            .findArticle({path:params.path}))
            .forEach((item,index)=>{
            let firstNum=(params.page-1)*params.oneNum;
            if(index<firstNum || 
                index>=firstNum+params.oneNum){
                return;
            }
            let formatDate=moment(item.created_at);
            let date1=formatDate.format('DD');
            let date2=formatDate.format('YYYY-MM');
            data.allTitle.push({
                title:item.title,
                date1:date1,
                date2:date2,
                summary:item.summary,
                path:'/detail?artId='+item._id
            });
        });
        //分页数据
        pageList(data,params);
        //公共数据
        await layoutData(data);
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            msg:'查找首页数据失败\n'+err.stack
        });
    }
    return data;
}
/*列表页数据}}}*/

async function layoutData(data){
/*公共数据{{{*/
    //首页头部banner
    data.banner1=[];
    let imgClass=['cube','cubeRandom','block','cubeStop'];
    (await artfileDao
        .findArticle({path:"栏目分类/首页Banner1"}))
        .forEach((item,index)=>{
        data.banner1.push({
            url:item.titleImg,
            imgClass:imgClass[
                randomNum(0,imgClass.length-1)]
        });
    });
}
/*公共数据}}}*/

function pageList(data,params){
/*分页数据{{{*/
    //文章总数
    data.number=data.allTitle.length;
    //分页
    data.allNum=[];
    //总页数
    let pageLength=Math.ceil(data.number/params.oneNum);
    //首页
    data.allNum.push({
        url:'/list/?path='+params.path+
            '&page='+1,
        pageNum:'首页',
    });
    //上一页
    let preNum=params.page>1 ? params.page-1 : 1;
    data.allNum.push({
        url:'/list/?path='+params.path+
            '&page='+preNum,
        pageNum:'上一页',
    });
    //页码
    for(let i=1;i<=pageLength;i++){
        data.allNum.push({
            url:'/list/?path='+params.path+
                '&page='+i,
            pageNum:i,
        });
    }
    //下一页
    let nextNum=pageLength>params.page ? 
        parseInt(params.page)+1 : pageLength;
    data.allNum.push({
        url:'/list/?path='+params.path+
            '&page='+nextNum,
        pageNum:'下一页',
    });
    //末页
    data.allNum.push({
        url:'/list/?path='+params.path+
            '&page='+pageLength,
        pageNum:'末页',
    });
}
/*分页数据}}}*/

async function leaveMsg(params){
/*保存在线留言{{{*/
    let data={};
    try{
        data.listTitle='在线留言'
        //公共数据
        layoutData(data);
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            msg:'查找首页数据失败\n'+err.stack
        });
    }
    return data;
}
/*保存在线留言}}}*/

async function addleaveMsg(params){
/*保存在线留言{{{*/
    let data={};
    try{
        res.render('main/leaveMsg',{
            layout:'main'
        });
    }catch(err){
    }
    return data;
}
/*保存在线留言}}}*/

