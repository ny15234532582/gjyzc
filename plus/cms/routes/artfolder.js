const path=require('path');
const vmbase=path.join(__dirname,'../viewModels/artfolder/');
//栏目viewMode
const artfolder=require(vmbase+'artFolder');
const artFolderLow=require(vmbase+'artFolderLow');
const artFolderAdd=require(vmbase+'artFolderAdd');
const artFolderRename=require(vmbase+'artFolderRename');
const artFolderRemove=require(vmbase+'artFolderRemove');
const artfolderProperty=require(vmbase+'artFolderProperty');
//权限
const artAuthPostGet=require(vmbase+'artAuthPostGet');
const artAuthChange=require(vmbase+'artAuthChange');

//栏目操作
module.exports=function(app){

    /**{{{ * 打开目录
     *
     * @api {GET} /manage/artfolder 打开目录
     * @apiDescription 打开目录，一般作为目录上右键菜单里面的打开目录
     *
     * @apiParam (query参数) {String} appendPath 需要打开的目录名称
     *
     * @apiSuccess {Html} data 下一层的html代码，用于html到main元素内
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/artfolder',artfolder);

    /**{{{ * 添加目录
     *
     * @api {POST} /manage/artFolderAdd 添加目录
     * @apiDescription 添加目录，一般作为空白处右键菜单里面的添加目录
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/artFolderAdd',artFolderAdd);

    /**{{{ * 删除目录
     *
     * @api {POST} /manage/artFolderRemove 删除目录
     * @apiDescription 删除目录，一般作为目录上右键菜单里面的删除目录
     *
     * @apiParam (body参数) {String} filename 需要删除的目录名称
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFolderRemove',artFolderRemove);

    /**{{{ * 重命名目录
     *
     * @api {POST} /manage/artFolderRename 重命名目录
     * @apiDescription 重命名目录，一般作为目录上右键菜单里面的重命名目录
     *
     * @apiParam (body参数) {String} filename 旧的目录名称
     * @apiParam (body参数) {String} nowName 新的目录名称
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFolderRename',artFolderRename);

    /**{{{ * 获取下层目录
     *
     * @api {GET} /manage/artfolderlow 获取下层目录名称数组
     * @apiDescription 获取下层目录的名称数组，用于动态添加到左侧菜单中
     *
     * @apiParam (query参数) {String} path 当前目录路径，目录之间以/分隔
     *
     * @apiSuccess {Array} lowFolder 下层目录数组
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/artfolderlow',artFolderLow);

    /**{{{ * 打开目录属性面板
     *
     * @api {GET} /manage/artfolderProperty 获取目录属性面板
     * @apiDescription 获取目录的属性面板，用于动态append到body属性中
     *
     * @apiParam (query参数) {String} filename 当前目录名称
     *
     * @apiSuccess {Html} data 文件夹属性面板html代码
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/artfolderProperty',artfolderProperty);

    /**{{{ * 获取目录权限
     *
     * @api {GET} /manage/artauthpostget 获取目录的访问权限
     * @apiDescription 获取职位相对于目录的访问权限
     *
     * @apiParam (query参数) {String} posiName 职位名称
     * @apiParam (query参数) {String} nowfolder 当前目录
     *
     * @apiSuccess {Boolean} status 是否获取成功
     * @apiSuccess {Char} auth 权限，a/b/c/d
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/artauthpostget',artAuthPostGet);

    /**{{{ * 修改目录权限
     *
     * @api {POST} /manage/artauthchange 修改目录权限后进行提交
     * @apiDescription 修改目录相对于职位的权限
     *                      a为禁止访问
     *                      b为只能查看，不能修改(默认)
     *                      c为可以修改和删除
     *                      d为可以审核
     *
     * @apiParam (body参数) {String} posiName 职位名称
     * @apiParam (body参数) {String} nowfolder 当前目录
     * @apiParam (body参数) {String} auto 职位相对于目录的权限
     *
     * @apiSuccess {Boolean} status 是否修改成功
     * @apiSuccess {Char} auth 权限，a/b/c/d
     *
     * @apiGroup ArtFolder_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artauthchange',artAuthChange);
}
