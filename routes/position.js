const vmbase = dirlist.viewModelPath+'position/';

const positionAddvm=require(vmbase+'positionAdd');
const positionRenamevm=require(vmbase+'positionRename');
const positionRemovevm=require(vmbase+'positionRemove');

module.exports=function(app){

    //提交职位修改
    app.post('/manage/addposition',positionAddvm);

    //职位重命名
    app.post('/manage/renameposition',positionRenamevm);

    //删除职位
    app.post('/manage/removeposition',positionRemovevm);

}

