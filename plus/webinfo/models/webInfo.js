var mongoose=require('mongoose');

//站点信息
var webinfoSchema = mongoose.Schema({
    //站点名称
    webName:String,
    //站点图片
    logo:String,
    //公司名称
    companyName:String,
    //公司地址
    address:String,
    //公司电话
    phone:String,
    //域名
    domainName:String
});

var webinfo = mongoose.model('webinfo',webinfoSchema);
module.exports = webinfo;
