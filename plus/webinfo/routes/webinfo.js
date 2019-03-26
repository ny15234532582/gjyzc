const path=require('path');
const vmbase=path.join(__dirname,'../viewModels/');

const webinfoAdd=require(vmbase+'webinfoAdd');
const webinfoShow=require(vmbase+'webinfoShow');

module.exports=function(app){
    //获取网站信息
    app.get('/manage/webinfo',webinfoShow);
    //修改网站信息
    app.post('/manage/webinfo',webinfoAdd);
}
