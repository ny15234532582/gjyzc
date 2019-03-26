let mongoose=require('mongoose');

//文章信息
let articleSchema = mongoose.Schema({
    //所属栏目
    artfolder:{type:'ObjectId',ref:'artfolder'},
    //路径
    path:String,
    //文章标题
    title:String,
    //标题图片
    titleImg:String,
    //外部链接
    skipLink:String,
    //阅读量
    readNumber:Number,
    //简介
    summary:String,
    //文章内容
    ArtContent:String,
},{
    //创建时间
    timestamps:{createdAt:'created_at'}
});

let article = mongoose.model('artfiles',articleSchema);
module.exports = article;
