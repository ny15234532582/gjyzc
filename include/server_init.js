const fs=require('fs');
const childProcess=require('child_process');

//初始化views/plus路径
fs.existsSync(dirlist.viewPath+'plus') || 
    fs.mkdirSync(dirlist.viewPath+'plus');

//插件初始化
tools.allPlus()
.then((allplus)=>{
    for(let key in allplus){
        serverInit(key);
    }
});
    
function serverInit(plusname){
/*插件views与public目录初始化{{{*/

    let plusViewPath=dirlist.plusPath+plusname+'/views';
    let rootViewPath=dirlist.rootPath+'views/plus/'+plusname;

    if(fs.existsSync(rootViewPath)){
        //清空项目根目录下的views目录中对应的插件目录
        childProcess.execSync('rm -rf '+rootViewPath);
    }
    if(fs.existsSync(plusViewPath)){
        //将本插件下的views里面的文件复制到项目根目录下的views目录中
        let cpViewToRoot='ln -s '+plusViewPath+' '+rootViewPath;
        childProcess.execSync(cpViewToRoot);
    }

}
/*插件views与public目录初始化}}}*/

