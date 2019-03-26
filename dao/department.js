const departmodel=require(dirlist.modelPath+'department');

module.exports={
    //创建部门
    createNewDepart:createNewDepart,
    //创建子部门后更新父部门
    addLowDepartments:addLowDepartments, 
    //根据部门路径查找部门
    pathFindDepart:pathFindDepart,
    //返回子部门组成的数组
    lowDepartmentsNameAry:lowDepartmentsNameAry,
    //部门路径正则表达式获取部门
    departPathRegDepart:departPathRegDepart,
    //从父部门中删除子部门
    deleteDepartments:deleteDepartments,
    //按正则表达式删除部门
    pathRegDelChildDepart:pathRegDelChildDepart,
}

function createNewDepart(departPath){
/*创建部门实体{{{*/
    return new Promise((resolve,reject)=>{
        let depart={departPath:departPath,
            lowDepartments:[],
            positions:[],
            describe:''};

        new departmodel(depart)
        .save((err,data)=>{
            if(err) return reject(err);
            return resolve(data); 
        }); 
    }); 
}
/*创建部门实体}}}*/

function pathFindDepart(departPath){
/*根据部门路径查找部门{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.findOne(
            {departPath:departPath})
            .populate('lowDepartments') 
            .populate('positions') 
            .exec((err,departOne)=>{
                if(err) return reject(err);
                return resolve(departOne); 
        }); 
    }); 
}
/*根据部门路径查找部门}}}*/

function lowDepartmentsNameAry(departPath){
/*返回子部门组成的数组{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.findOne(
            {departPath:departPath},
            {'lowDepartments':1}) 
        .populate('lowDepartments')
        .exec((err,depart)=>{
            if(err) return reject(err);
            var lowDepartAry=[];
            depart && depart.lowDepartments && 
                depart.lowDepartments.forEach(
                (currentValue,index)=>{
                    if(currentValue){
                        //子部门名称
                        var departName=
                            currentValue.departPath.split('/');
                        departName=departName[
                            departName.length-1];
                        lowDepartAry.push(departName);
                    }
                });
            return resolve(lowDepartAry);
        })
    });
}
/*返回子部门组成的数组}}}*/

function departPathRegDepart(departPath){
/*部门路径正则表达式获取部门{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.find(
            {departPath:{$regex:'^'+departPath+'($|/)'}})
        .exec(function(err,departs){
            if(err) return reject(err);
            return resolve(departs);
        }); }); }
/*部门路径正则表达式获取部门}}}*/

function addLowDepartments(params){
/*创建子部门后更新父部门{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.updateOne(
            {departPath:params.departPath},
            {$push:{lowDepartments:params.departId}},
            function(err,data){
                if(err) return reject(err);
                return resolve(data); }) }); };
/*创建子部门后更新父部门}}}*/

function deleteDepartments(params){
/*删除部门{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.updateOne(
            {departPath:params.departPath},
            {$pull:{lowDepartments:params.departId}},
            function(err,data){ 
                if(err) return reject(err);
                return resolve(data); 
            }) 
    }); 
}
/*删除部门}}}*/

function pathRegDelChildDepart(departPath){
/*按正则表达式删除部门{{{*/
    return new Promise((resolve,reject)=>{
        departmodel.deleteMany(
            {departPath:{$regex:'^'+departPath+'($|/)'}},
            function(err,data){if(err) 
                return reject(err); 
                return resolve(data);}); }); }
/*按正则表达式删除部门}}}*/

