const depaDataSec=require(dirlist.dataSecPath+'department');

module.exports=function(req,res,next){

    if(req.xhr){
        let params={
            //用户编号
            userId:req.session.userId,
            //需要显示的目录 
            showdepart:unescape(req.query.path),
        }

        //从数据库根据路径显示目录
        clientParams(params)
        .then((cliParams)=>{
            return res.render('folderShow',cliParams);
        });

    }else next();

}

async function clientParams(params){
/*需要传给客户端的数据{{{*/
    //面包屑
    params.folderPath=params.showdepart.split('/');
    //获取部门实体
    let departOne=await depaDataSec
        .pathFindDepart({
            userId:params.userId,
            departPath:params.showdepart });

    if(departOne){
        //部门
        params.lowFolders=
            getlowDepartmentsPaths(departOne.lowDepartments);
        //职位
        params.artfiles=[];
        departOne.positions.forEach((item)=>{
            params.artfiles.push(item.name);
        });
    }

    //页面固定的数据
    pageBaseData(params);

    return params;
}
/*需要传给客户端的数据}}}*/

function pageBaseData(params){
/*页面固定的数据{{{*/
    params.layout=null;
    //右键菜单1
    params.rightMenus1=
        ['新建部门','新建职位','全选','属性'];
    //右键菜单2
    params.rightMenus2=
        ['打开','重命名','删除','属性'];
    //客户端动作列表
    params.cliAction='zzjgAction';
}
/*页面固定的数据}}}*/

function getlowDepartmentsPaths(lowDepart){
/*将当前子部门的名称转换为数组{{{*/
    let lowDepartAry=[];
    let is_array=function(value){
        return Object.prototype.toString.apply(value)
            === '[object Array]';
    }
    if(is_array(lowDepart) && lowDepart.length>0)
        lowDepart.forEach((item,index)=>{
            let itemAry= item.departPath.split('/');
            lowDepartAry.push(itemAry[itemAry.length-1]);
        });

    return lowDepartAry;
}
/*将当前子部门的名称转换为数组}}}*/
