const mongoose=require('mongoose');

//用户
let userSchema = mongoose.Schema({
    //帐号
    userName:String,
    //姓名
    name:String,
    //电话
    phone:String,
    //邮箱
    Email:String,
    //地址
    address:String,
    //QQ
    qq:String,
    //微信
    weixin:String,
    //所属职位
    position:{type:'ObjectId',ref:'position'},
    //密码
    userPassword:String,
    //是否启用
    enable:Boolean,
    //上次登陆时间
    prevLoginDate:Date,
    //上次登陆IP
    prevLoginIP:String,
},{
    //创建时间
    timestamps:{createdAt:'created_at'}
});

let user = mongoose.model('user',userSchema);
module.exports = user;
