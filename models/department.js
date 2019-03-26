const mongoose=require('mongoose');

//部门
let departmentSchema = mongoose.Schema({
    //部门路径
    departPath:String,
    //子部门
    lowDepartments:[{
        type:'ObjectId',ref:'department' }],
    //职位列表
    positions:[{type:'ObjectId',ref:'position' }],
    
    //描述
    describe:String,
},{
    //创建时间
    timestamps:{createdAt:'created_at'}
});

let department = mongoose.model('department',departmentSchema);
module.exports = department;
