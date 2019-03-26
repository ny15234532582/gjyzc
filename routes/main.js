const vmbase = '../viewModels/main/';
const indexGet = require(vmbase+'index');
const detail = require(vmbase+'detail');
const list = require(vmbase+'list');
const leaveMsg = require(vmbase+'leaveMsg');

module.exports=function(app){
    //首页
    app.get('/',indexGet);
    //详情页
    app.get('/detail',detail);
    //列表页
    app.get('/list',list);
    //在线留言
    app.get('/leaveMsg',leaveMsg);
}
