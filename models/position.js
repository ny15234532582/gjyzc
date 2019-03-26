const mongoose=require('mongoose');

//职位
let positionSchema = mongoose.Schema({
    //职位名称
    name:String,
    //所属部门
    department:{type:'ObjectId',ref:'department'},
    //描述
    describe:String,
},{
    //创建时间
    createAt:{createdAt:'created_at'}
});

let position = mongoose.model('position',positionSchema);
module.exports = position;
