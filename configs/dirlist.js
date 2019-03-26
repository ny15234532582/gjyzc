const path=require('path');
//根目录
const rootPath=path.join(__dirname,'../');

//目录说明
module.exports={
    //根目录
    rootPath:rootPath,
    //插件目录
    plusPath:path.join(rootPath,'plus/'),
    //服务器静态目录
    staticPath:path.join(rootPath,'public/'),
    //配置目录
    confPath:path.join(rootPath,'configs/'),
    //库目录
    includePath:path.join(rootPath,'include/'),
    //路由目录
    routePath:path.join(rootPath,'routes/'),
    //模板目录
    viewPath:path.join(rootPath,'views/'),
    //视图模型
    viewModelPath:path.join(rootPath,'viewModels/'),
    //数据安全层
    dataSecPath:path.join(rootPath,'dataSecurity/'),
    //DAO层
    daoPath:path.join(rootPath,'dao/'),
    //数据库模型
    modelPath:path.join(rootPath,'models/'),
}
