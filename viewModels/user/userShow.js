const dataSecUser=require(dirlist.dataSecPath+'user');

module.exports=function(req,res,next){

    //初始化参数
    let params={ 
        //用户编号
        userId:req.session.userId,
        //单页条数
        onepageNum:Number(req.query.onepageNum) || 10,
        //当前页码
        nowNum:(()=>{ 
            var nowNum;
            if(!req.params.pageNum ||
                req.params.pageNum=='null') nowNum=1;
            else nowNum=req.params.pageNum
            return nowNum; 
        })(),
    };

    clientParams(params)
    .then((cliParams)=>{
        return res.render('listShow',cliParams);  
    });

}

async function clientParams(params){
/*需要传给客户端的数据{{{*/

    //从数据库查找数据
    let result=await dataSecUser.userPage(params);

    //总文章数量
    params.allNumber=result.userNum; 

    //页码数组
    params.pageAry=(()=>{ 
        var pageAry=[];
        for(var i=0; i<Math.ceil(
            result.userNum/params.onepageNum);i++){
            pageAry[i]=i+1; 
        }
        return pageAry;
    })();

    //为每一行添加用户参数
    params.allRow=[];
    result.users.forEach((item)=>{
        params.allRow.push({
            //是否需要复选框
            checkbox:true,
            //首列
            firstcol:item.userName,
            //单行操作
            liBtnGroup:[
                '<a class="iconfont changeinfo" '+
                    'href="javascript:;">&#xe791;</a>',
                '<a class="iconfont showinfo" '+
                    'href="javascript:;">&#xe61a;</a>'],
            //每一列的属性
            colType:[item.name,item.address,item.phone,
                item.Email,item.qq,item.weixin],
            //是否显示状态
            showEnable:true, 
            //帐号是否启用
            enable:item.enable 
        }); 
    }); 

    //固有的一些页面参数
    pageBaseData(params);
    
    return params;
}
/*需要传给客户端的数据}}}*/

function pageBaseData(params){
/*页面固定的数据{{{*/

    params.layout=null;

    //客户端JS文件名称
    params.clientAction='usermanage';

    //搜索条件
    params.searchCondition=[
        {label:'用户名',inputType:'text'},
        {label:'地址',inputType:'text'},
        {label:'启用',inputType:'checkbox'},
        {label:'停用',inputType:'checkbox'} ];

    //页面标题
    params.title='用户列表';

    //批量操作
    params.batchOperation=[
        {class:'resetPass',
         icon:'&#xe60b;',
         showName:'重置密码'},
        {class:'removeUserBtn',
         icon:'&#xe7e2;',
         showName:'删除'},
        {class:'Enableleft',
         icon:'&#xe767;',
         showName:'启用'},
        {class:'Enableright',
         icon:'&#xe662;',
         showName:'停用'},
        {class:'add',
         icon:'&#xe614;',
         showName:'添加'}]; 

    //表格头部
    params.tableTitle=[
        '<input type="checkbox"></input>',
        '用户名','','姓名','地址','电话',
        '邮箱','QQ','微信','状态'];

}
/*页面固定的数据}}}*/

