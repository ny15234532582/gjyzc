const usermodel=require(dirlist.modelPath+'user');
const posiDataSec=require(dirlist.dataSecPath+'position');

module.exports={
    //添加职位
    userAdd:userAdd,
    //修改用户密码
    changeUserPass:changeUserPass,
    //修改用户启用停用状态
    changeUserDisable:changeUserDisable,
    //用户名正则表达式重置用户密码
    userNameRegexResetPass:userNameRegexResetPass,
    //用户帐号获取用户信息
    userNamefindUser:userNamefindUser,
    //用户帐号获取密码,是否启用
    userNamefindUserPass:userNamefindUserPass,
    //通过条件查找分页用户
    whereFindUserPage:whereFindUserPage,
    //根据条件获取用户的总数
    allUserNumber:allUserNumber,
    //根据用户名的正则表达式删除职位
    userNameRegexDeleteUser:userNameRegexDeleteUser,
    //通过条件查找用户
    findUser:findUser,
}

async function userAdd(params){
/*添加职位{{{*/
    params.posi=null;

    //解析所属部门
    if(params.belongToRole){
        let data=await posiDataSec.getDepartmentId({
            belongToRole:params.belongToRole });
        if(data){ 
            params.position=data.position;
        }
    }

    let userOne=await userNamefindUser(params.userName); 
    if(userOne)
        return updateUser(params);
    else 
        return userAddNew(params);
}
/*添加职位}}}*/

function updateUser(params){
/*更新用户信息{{{*/
    //保存至数据库
    return new Promise((resolve,reject)=>{
        userNamefindUser(params.userName)
        .then((user)=>{
            user.save((err,data)=>{
                if(err) return reject(err);
                resolve(data); 
            }); 
        }); 
    }); 
}
/*更新用户信息}}}*/

function userAddNew(params){
/*添加一个新的用户{{{*/
    return new Promise((resolve,reject)=>{
                    
        var newuser={ userName:params.userName, 
            name:params.name,
            phone:params.phone,
            Email:params.Email,
            address:params.address,
            qq:params.qq,
            weixin:params.weixin,
            prevLonginDate:new Date(),
            position:params.position,
            enable:true };
        new usermodel(newuser).save(
            function(err,data){
            if(err) reject(err);
            resolve(data); 
        }); 
    }); 
}
/*添加一个新的用户}}}*/

function changeUserPass(params){
/*修改用户密码{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.updateOne({_id:params.userId},
            {$set:{userPassword:params.password}},
            (err,data)=>{
                if(err) reject(err);
                resolve(data); 
            });
    });
}
/*修改用户密码}}}*/

function changeUserDisable(params){
/*修改用户启用停用状态{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.updateMany({userName:{$in:params.userName}},
        {$set:{enable:params.enable}},
        {upsert:true})
        .exec( (err, data)=>{
            if(err) return reject(err);
            return resolve(data); 
        }); 
    }); 
}
/*修改用户启用停用状态}}}*/

function userNameRegexResetPass(userNameReg){
/*用户名正则表达式重置用户密码{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.updateMany(
            {userName:{$regex:userNameReg}},
            {$set:{userPassword:''}},
            function(err,data){ 
                if(err) return reject(err);
                return resolve(data); }); }); }
/*用户名正则表达式重置用户密码}}}*/

function userNamefindUser(userName){
/*通过用户帐号获取用户信息{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.findOne({userName:userName})
        .populate('position')
        .exec((err,user)=>{ 
            if(err) return reject(err);

            return resolve(user); 
        }); 
    }); 
}
/*通过用户帐号获取用户信息}}}*/

function userNamefindUserPass(userName){
/*通过用户帐号获取用户信息{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.findOne({userName:userName},
            {'userPassword':1,'enable':1})
        .exec((err,user)=>{ 
            if(err) reject(err);
                resolve(user); }); }); }
/*通过用户帐号获取用户信息}}}*/

function whereFindUserPage(params){
/*通过条件查找分页用户{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.find(params.where)
        .skip(params.skipNum).limit(params.onepageNum)
        .exec((err,users)=>{
            if(err) return reject(err);
            return resolve(users); }); }); }
/*通过条件查找分页用户}}}*/

function allUserNumber(where){
/*根据条件获取用户的总数{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.find(where)
        .exec((err,data)=>{
            if(err) return reject(err);
            return resolve(data);
        });
    });
}
/*根据条件获取用户的总数}}}*/

function userNameRegexDeleteUser(userNameReg){
/*根据用户名的正则表达式删除职位{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.deleteMany(
            {userName:{$regex:userNameReg}},
            (err,data)=>{ 
                if(err) return reject(err);
                return resolve(data);
        });
    });
}
/*根据用户名的正则表达式删除职位}}}*/

function findUser(where){
/*通过条件查找用户{{{*/
    return new Promise((resolve,reject)=>{
        usermodel.find(where)
        .populate('position')
        .exec((err,user)=>{ 
            if(err) return reject(err);
            resolve(user); 
        }); 
    });
}
/*通过条件查找用户}}}*/

