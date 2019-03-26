const path=require('path');
const vmbase=path.join(__dirname,'../viewModels/');

const index=require(vmbase+'index');

//文章列表
module.exports=function(app){
    app.get('/',index);
}
