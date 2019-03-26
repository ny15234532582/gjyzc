const depDao=require(dirlist.daoPath+'department');

const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //根据部门路径查找部门
    pathFindDepart:pathFindDepart,
    //返回子部门的名称组成的数组
    findLowDepartments:findLowDepartments,
    //删除部门
    deleteDepartments:deleteDepartments,
    //创建部门
    createDepart:createDepart,
    //重命名部门
    renameDepartName:renameDepartName,
}

async function pathFindDepart(params){
/*根据部门路径查找部门{{{*/
    let departOne={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有权限浏览部门['+params.departPath+']'});

        //查找部门
        departOne=await depDao
            .pathFindDepart(params.departPath);

        //如果没有顶级部门，则创建
        if(!departOne && params.departPath=='部门管理'){
            await depDao.createNewDepart('部门管理');
        } 

    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']浏览部门['+params.departPath+
                ']出现错误\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'浏览部门失败'
        });
    }
    return departOne;
}
/*根据部门路径查找部门}}}*/

async function findLowDepartments(params){
/*返回子部门的名称组成的数组{{{*/
    let lowDepartAry=[];
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有权限获取部门['+params.departPath+
                ']的子部门'});

        //获取子部门
        lowDepartAry=await depDao
            .lowDepartmentsNameAry(params.departPath);

    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']查找路径['+params.departPath+
                ']下的子部门出现错误\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });

        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'查找子部门失败'
        });
    }
    return lowDepartAry;
}
/*返回子部门的名称组成的数组}}}*/

async function deleteDepartments(params){
/*删除部门{{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有删除部门['+params.departPath+
                ']的权限'});

        //查找部门
        let depart=await depDao
            .pathFindDepart(params.departPath);

        //删除子部门索引
        await depDao.deleteDepartments({
            departPath:params.departPath,
            departId:depart._id });

        //删除子部门实体
        await depDao.pathRegDelChildDepart(params.departPath);

        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']删除子部门['+params.departPath+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'删除部门成功',
            roomMsg:'用户['+user.name+
                ']删除部门['+params.departPath+
                ']成功' });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                '删除部门['+params.departPath+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'删除部门失败'});
    }
    return data;
}
/*删除部门}}}*/

async function renameDepartName(params){
/*重命名部门 {{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有重命名部门['+params.departPath+
                ']的权限'});

        //替换
        let index=params.departPath.lastIndexOf('/');
        let ParentPath=params.departPath.substring(0,index);
        let newPathVar=ParentPath+'/'+params.newPath;
        let lowDepartAry=await depDao
            .lowDepartmentsNameAry(ParentPath);

        //重复性检测
        lowDepartAry.forEach((item)=>{
            if(item==params.newPath){
                throw new Error(
                    '重命名失败，因为存在相同名称的部门');
            }
        });

        //获取部门和子部门
        let departs=await depDao
            .departPathRegDepart(params.departPath);

        //重命名部门
        for(let i=0;i<departs.length;i++){
            let curVal=departs[i];
            curVal.departPath=curVal.departPath.replace(
                    params.departPath,newPathVar);
            await new Promise((resolve,reject)=>{
                curVal.save((err)=>{
                    if(err) return reject(err);
                    resolve();
                });
            });
        }

        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+user.name+
                ']将部门['+params.departPath+
                ']重命名为['+params.newPath+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'重命名部门成功',
            roomMsg:'用户['+user.name+
                ']将部门['+params.departPath+
                ']重命名为['+params.newPath+
                ']成功' });
    }catch(err){
        //失败后的提示信息
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']重命名部门['+params.departPath+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });

        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'重命名部门失败'
        });
    }
    return data;
}
/*重命名部门 }}}*/

async function createDepart(params){
/*创建部门{{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有在部门['+params.departPath+
                ']下创建部门的权限'});

        //查找父部门
        let depart=await depDao
            .pathFindDepart(params.departPath);

        //获取下一个部门的自增长序号
        let maxNum=maxDepartNum(
            depart && depart.lowDepartments);
        
        //新建部门
        let departNew=await depDao
            .createNewDepart(params.departPath+
            '/新建部门'+(maxNum+1));

        //向父部门添加外键
        await depDao.addLowDepartments({
            departPath:params.departPath,
            departId:departNew._id})

        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']创建['+params.departPath+
                ']下的子部门[新建部门'+(maxNum+1)+
                ']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'创建部门成功',
            roomMsg:'用户['+user.name+
                ']创建部门['+params.departPath+
                ']下的子部门[新建部门'+(maxNum+1)+
                ']成功' });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']创建['+params.departPath+
                ']下的子部门失败\n'+err.stack+
                '\n参数：\n\t'+JSON.parse(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg:'创建部门失败' });
    }
    return data;
}
/*创建部门}}}*/

function maxDepartNum(lowDepart){
/*获取最大的部门名称{{{*/

    //如果为字符串，则转换为数组
    if(!(lowDepart instanceof Array)
        && lowDepart.length>0)
        lowDepart=[lowDepart];

    //返回最大值
    let maxNum=0;
    if(Object.prototype.toString.apply(lowDepart)
        === '[object Array]' && lowDepart.length>0){
        lowDepart.forEach((item,index)=>{
            if(item){
                let itemAry=item.departPath.split('/');

                let departName=itemAry[itemAry.length-1];
                let num=Number(
                    departName.replace(/[^0-9]/ig,''));
                if(maxNum<num) 
                    maxNum=num;
            }
        });
    }
    return maxNum;
}
/*获取最大的部门名称}}}*/

