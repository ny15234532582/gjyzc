const posiDao=require(dirlist.daoPath+'position');
const departDao=require(dirlist.daoPath+'department');
const sockDataSec=require(dirlist.dataSecPath+'socket');

module.exports={
    //添加一个新的职位
    addNewPosition:addNewPosition,
    //重命名一个职位
    renamePosition:renamePosition,
    //删除一个职位
    removePosition:removePosition,

    //使用职位路径获取所属部门Id与职位名称
    getDepartmentId:getDepartmentId,

}

async function addNewPosition(params){
/*添加一个新的职位{{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有在部门['+params.departPath+
                ']下新增职位的权限'});
        //从数据库获取部门实体
        let depart=await departDao
            .pathFindDepart(params.departPath);
        //下一个职位的编号
        let maxNum=nextPosiNum(depart.positions);
        //新建职位
        let  newPosi=await posiDao.createPosition({
            department:depart._id,
            name:'新增职位'+(maxNum+1),
            describe:'',
        });
        //将职位与上级部门进行关联
        depart.positions.push(newPosi);
        await new Promise((resolve,reject)=>{
            depart.save((err)=>{
                if(err) return reject(err);
                resolve();
            })
        });
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在['+params.departPath+
                ']下添加[新增职位'+(maxNum+1)+']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg: '新增职位成功',
            roomMsg:'用户['+params.userId+
                ']在['+params.departPath+
                ']下添加[新增职位'+maxNum+']成功' });
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在['+params.departPath+
                ']下添加新增职位失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg: '新增职位失败' });
    }
    return data;
}
/*添加一个新的职位}}}*/

async function renamePosition(params){
/* 重命名一个职位 {{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有在部门['+params.departPath+
                ']下重命名职位的权限'});

        let depart=await departDao
            .pathFindDepart(params.departPath);
        //重复性检测
        depart.positions.forEach((item)=>{
            if(item.name==params.nowName){
                throw new Error(
                    '重命名失败，因为存在相同名称的部门');
            }
        });
        //重命名职位
        params.departId=depart._id;
        data=await posiDao.positionRename(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在部门['+params.departPath+
                ']下将职位['+params.oldName+
                ']修改为['+params.nowName+']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg:'职位重命名成功',
            roomMsg:'用户['+params.userId+
                ']在部门['+params.departPath+
                ']下将职位['+params.oldName+
                ']修改为['+params.nowName+
                ']成功'});
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在部门['+params.departPath+
                ']下将职位['+params.oldName+
                ']修改为['+params.nowName+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg: '重命名职位失败' });
    }
    return data;
}
/* 重命名一个职位 }}}*/

async function removePosition(params){
/* 删除一个职位 {{{*/
    let data={};
    try{
        //权限判断
        let user=await tools.isAdmin({
            userId:params.userId,
            msg:'您没有在部门['+params.departPath+
                ']下删除职位的权限'});
        //删除职位
        data=await posiDao.positionRemove(params);
        //成功后的消息提示
        tools.msg({
            type:'info',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在部门['+params.departPath+
                ']下删除职位['+params.positionName+']成功'
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Find',
            msg: '删除职位成功',
            roomMsg:'用户['+user.name+
                ']在部门['+params.departPath+
                ']下删除职位['+params.positionName+
                ']成功'});
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            userId:params.userId,
            msg:'用户['+params.userId+
                ']在部门['+params.departPath+
                ']下删除职位['+params.positionName+
                ']失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.userId,
            msgType:'Error',
            msg: '删除职位失败' });
    }
    return data;
}
/* 删除一个职位 }}}*/

async function getDepartmentId(params){
/*使用职位路径获取所属部门Id与职位名称{{{*/
    let data={};
    try{
        //如果传入的参数为空，则直接返回
        if(!params.belongToRole) return null;

        let departpath=params.belongToRole.split('/');
        let posi=departpath.splice(-1,1);
        departpath=departpath.join('/');
        //根据路径获取部门实体
        let departOne=await departDao
            .pathFindDepart(departpath);

        //根据部门实体ID和职位名称获取职位
        let position=await posiDao
            .findPosition({
                department:departOne._id,
                name:posi});
        //获取第一个职位
        if(position.length==1){
            data.position=position[0]._id;
        }else{
            throw new Error('根据部门ID为['+departOne._id+
                ']，职位为['+posi+
                ']，查找到'+position.length+
                '个职位对象');
        }
    }catch(err){
        //失败后的消息提示
        tools.msg({
            type:'error',
            msg:'根据'+params.belongToRole+
                '获取所属部门ID与职位名称失败\n'+err.stack+
                '\n参数：\n\t'+JSON.stringify(params)
        });
        sockDataSec.sendMsg({
            userId:params.user._id,
            msgType:'Error',
            msg: '获取部门实体失败'
        });
    }
    return data;
}
/*使用职位路径获取所属部门Id与职位名称}}}*/

function nextPosiNum(positions){
/*获取最大的职位数字{{{*/

    //如果为字符串，则转换为数组
    if(!(positions instanceof Array)
        && positions.length>0)
        positions=[positions];

    //返回最大值
    var maxNum=0;
    if(Object.prototype.toString.apply(positions)
        === '[object Array]' && positions.length>0){
        for(let i=0;i<positions.length;i++){
            let item=positions[i].name || '';
            let num=Number(
                item.replace(/[^0-9]/ig,''));
            if(maxNum<num) 
                maxNum=num;
        }
    }
    return maxNum;
}
/*获取最大的职位数字}}}*/

