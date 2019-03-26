const vmbase = dirlist.viewModelPath+'user/';
//用户viewMode
const userAddvm = require(vmbase+'userAdd');
const userInfovm = require(vmbase+'userInfo');
const userShowvm = require(vmbase+'userShow');
const userRemovevm = require(vmbase+'userRemove');
const userchangevm = require(vmbase+'userChangePage');
const userEnablevm = require(vmbase+'userEnable');
const userDisablevm = require(vmbase+'userDisable');
const userResetPassvm = require(vmbase+'userResetPass');

module.exports=function(app){
    
    //用户管理
    app.get('/manage/usermanage/:pageNum',userShowvm);
    //获取用户修改界面
    app.get('/manage/adduser/:userName',userchangevm);

    //获取用户信息
    app.get('/manage/userinfo/:userName',userInfovm);
    //启用用户帐号
    app.post('/manage/enableuser',userEnablevm);
    //停用用户帐号
    app.post('/manage/disableuser',userDisablevm);
    //重置用户密码
    app.post('/manage/resetpass',userResetPassvm);
    //提交用户修改
    app.post('/manage/adduser/:userName',userAddvm);

    //删除用户信息
    app.post('/manage/removeuser',userRemovevm);
}
