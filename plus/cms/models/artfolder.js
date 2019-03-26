let mongoose=require('mongoose');

//栏目信息
let artFolder =new mongoose.Schema({
    //路径
    path:String,
    //子目录列表
    lowFolders:[{type:'ObjectId',ref:'artfolder'}],
    //文章列表
    artfiles:[{type:'ObjectId',ref:'artfiles'}],
    //创建时间
    createDate:Date,
    //创建作者
    createUser:{type:'ObjectId',ref:'user'},
    //描述
    describe:String,
    //允许创建和删除的职位ID
    creaordelposi:[{type:'ObjectId',ref:'position' }],
    //允许审核的职位ID
    examineposi:[{type:'ObjectId',ref:'position' }],
    //禁止访问的职位ID
    noentry:[{type:'ObjectId',ref:'position' }]
},{
    //创建时间
    timestamps:{createdAt:'created_at'}
});

let artfolder = mongoose.model('artfolder',artFolder);
module.exports = artfolder;
