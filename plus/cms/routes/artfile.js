const path=require('path');
const vmbase=path.join(__dirname,'../viewModels/artfile/');
//viewMode根目录
const ueUploadPath=require(vmbase+'ueUploadPath');
//文章viewMode
const artFileAdd=require(vmbase+'artFileAdd');
const artFileChange=require(vmbase+'artFileChange');
const artFileOpen=require(vmbase+'artFileOpen');
const artFileRemove=require(vmbase+'artFileRemove');
const artFileRename=require(vmbase+'artFileRename');

//文章列表
module.exports=function(app){

    /**{{{ * 打开文章编辑页面
     *
     * @api {POST} /manage/artFileOpen 打开文章编辑页面
     * @apiDescription 外部访问一般用于在文件上右键打开文章编辑页面
     * @apiParam (body参数) {String} filename 将要编辑的文章名称
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFileOpen',artFileOpen);

    /**{{{ * 添加文章
     *
     * @api {POST} /manage/artFileAdd 添加文章
     * @apiDescription 外部访问一般用于在空白处右键添加文章
     * @apiParam (body参数) {String} none 不需要添加参数，系统会自动创建文章名称
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFileAdd',artFileAdd);

    /**{{{ * 删除文章
     *
     * @api {POST} /manage/artFileRemove 删除文章
     * @apiDescription 外部访问一般用于在文件上右键删除
     * @apiParam (body参数) {String} filename 被删除的文章名称
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.use('/manage/artFileRemove',artFileRemove);

    /**{{{ * 文章重命名
     *
     * @api {POST} /manage/artFileRename 文章重命名
     * @apiDescription 外部访问一般用于在文件上右键重命名
     * @apiParam (body参数) {String} oldName 旧的文章标题
     * @apiParam (body参数) {String} nowName 新的文章标题
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFileRename',artFileRename);

    /**{{{ * 文章修改提交
     *
     * @api {POST} /manage/artFileChange 文章修改提交到数据库
     * @apiDescription 用于文章编辑后提交到数据库,提交方式为enctype="multipart/form-data"
     * @apiParam (mult表单参数) {String} title 文档标题
     * @apiParam (mult表单参数) {String} logo 封面图片地址
     * @apiParam (mult表单参数) {String} skipLink 跳转地址,如果此文章点击详情是跳转到外部链接，可以填写此跳转地址
     * @apiParam (mult表单参数) {String} summary 文章简介
     * @apiParam (mult表单参数) {String} editorContain 文章具体内容
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/artFileChange',artFileChange);

    /**{{{ * 编辑器图片上传
     *
     * @api {ALL} /server/uEditorLib/ueditor/ue 编辑器图片上传
     * @apiDescription 用于百度编辑器图片上传接口
     * @apiGroup ArtFile_Route
     * @apiVersion 1.0.0
     *///}}}
    app.use("/plus/cms/uEditorLib/ueditor/ue",ueUploadPath);

}
