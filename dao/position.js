const departDao=require(dirlist.daoPath+'department');
const departModel=require(dirlist.modelPath+'department');
const positionModel=require(dirlist.modelPath+'position');

module.exports={
    //创建职位
    createPosition:createPosition,
    //重命名职位
    positionRename:positionRename,
    //获取所有职位(树状)
    positionsTree:positionsTree,
    //获取所有职位
    allPosi:allPosi,
    //删除职位
    positionRemove:positionRemove,
    //根据条件获取职位
    findPosition:findPosition,
}

function createPosition(params){
/*创建职位{{{*/
    return new Promise((resolve,reject)=>{
        let position={
            name:params.name,
            describe:params.describe,
            department:params.department,
        }
        new positionModel(position)
        .save((err,data)=>{
            if(err) return reject(err);
            return resolve(data);
        });
    });
}
/*创建职位}}}*/

function positionRename(params){
/*重命名职位{{{*/
    return new Promise((resolve,reject)=>{
        positionModel.updateOne({
            department:params.departId,
            name:params.oldName },
            {$set:{name:params.nowName}},
            (err,data)=>{
                if(err) return reject(err);
                resolve(data);
            });
    });
}
/*重命名职位}}}*/

function positionsTree(){
/*获取所有职位(树状){{{*/
    return new Promise((resolve,reject)=>{
        departModel.find({})
        .populate('positions')
        .exec((err,departments)=>{
            if(err) return reject(err);
            let allPosi=[];
            departments.forEach((item,index)=>{
                if(item.positions 
                    && item.positions.length>0){
                    //职位数组
                    let posiAry=[];
                    item.positions.forEach((item1)=>{
                        posiAry.push(item1.name);
                    });
                    //将所有职位信息添加到结果数组中
                    allPosi.push({
                        path:item.departPath,
                        posiAry:posiAry,
                    });
                }
            });
            resolve(allPosi); 
        });
    });
}
/*获取所有职位(树状)}}}*/

function allPosi(){
/*获取所有职位{{{*/
    return new Promise((resolve,reject)=>{
        departModel.find({},(err,departments)=>{
            if(err) return reject(err); 
            var allposi=[];
            departments.forEach((item,index)=>{
                var posis=item.positions;
                posis.forEach((posiitem,index)=>{
                    var posivar=
                        item.departPath+'/'+posiitem;
                    posivar=
                        posivar.replace(/^部门管理\//,'');
                    allposi.push(posivar); }); });
            resolve(allposi); 
        }); 
    });
}
/*获取所有职位}}}*/

async function positionRemove(params){
/*删除职位{{{*/
    let depart=await departDao
        .pathFindDepart(params.departPath);
    //寻找职位ID
    depart.positions.forEach((item)=>{
        if(item.name==params.positionName){
            params.posiId=item._id;
            return false;
        }
    });
    //从父部门删除职位
    await depDelPosi(params);
    //删除当前职位
    let data=await delNowPosi(params.posiId);
    return data;
}
/*删除职位}}}*/

function depDelPosi(params){
/*从父部门中删除职位{{{*/
    return new Promise((resolve,reject)=>{
        departModel.updateOne(
            {departPath:params.departPath},
            {$pull:{positions:params.posiId}},
            (err,data)=>{ 
                if(err) return reject(err);
                resolve(); 
            }); 
    });
}
/*从父部门中删除职位}}}*/

function delNowPosi(posiId){
/*从职位表中删除职位{{{*/
    return new Promise((resolve,reject)=>{
        positionModel.deleteOne({ _id:posiId },
        (err,data)=>{
            if(err) return reject(err);
            resolve(data);
        });
    });
}
/*从职位表中删除职位}}}*/

function findPosition(where){
/*根据条件获取职位{{{*/
    return new Promise((resolve,reject)=>{
        positionModel.find(where)
        .populate('department')
        .exec((err,data)=>{
            if(err) return reject(err);
            resolve(data);
        });
    });
}
/*根据条件获取职位}}}*/

