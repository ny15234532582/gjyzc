const vmbase = dirlist.viewModelPath+'department/';
//部门viewMode
const departmentShowvm = require(vmbase+'departmentShow');
const departmentLowvm = require(vmbase+'departmentLow');
const departmentAddvm = require(vmbase+'departmentAdd');
const departmentRemovevm = require(vmbase+'departmentRemove');
const departmentRenamevm = require(vmbase+'departmentRename');

module.exports=function(app){

    /**{{{ * 打开当前部门
     *
     * @api {GET} /manage/department 打开当前部门
     * @apiDescription 根据req.session.nowdepartment路径，打开当前路径。
     *
     * @apiParam (query参数) {String} path escape编码后的当前部门路径，部门之间以/分隔
     *
     * @apiSuccess {Html} data 当前部门的Html代码，用于$('html').html(data);
     *
     * @apiGroup Department_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/department',departmentShowvm)

    /**{{{ * 获取下层部门
     *
     * @api {GET} /manage/lowDepartment 获取下层部门名称数组
     * @apiDescription 获取下层部门数组，用于动态添加到左侧菜单中
     *
     * @apiParam (query参数) {String} path 当前部门路径，部门之间以/分隔
     *
     * @apiSuccess {Array} lowFolder 下层部门数组
     *
     * @apiGroup Department_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/lowDepartment',departmentLowvm)

    /**{{{ * 添加部门
     *
     * @api {POST} /manage/adddepartment 添加部门
     * @apiDescription 添加部门
     *
     * @apiParam (body参数) {String} departPath escape编码后的当前部门路径
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup Department_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/adddepartment',departmentAddvm);

    /**{{{ * 重命名部门
     *
     * @api {POST} /manage/renamedepartment 重命名部门
     * @apiDescription 重命名部门
     *
     * @apiParam (body参数) {String} path escape编码后的部门总路径，带当前部门
     * @apiParam (body参数) {String} nowName 修改后的当前部门名称
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup Department_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/renamedepartment',departmentRenamevm);
    
    /**{{{ * 删除部门
     *
     * @api {POST} /manage/removedepartment 删除部门
     * @apiDescription 删除部门
     *
     * @apiParam (body参数) {String} departPath escape编码后的部门路径，不带当前部门
     * @apiParam (body参数) {String} departName 当前部门名称
     *
     * @apiSuccess {Boolean} status 是否成功
     * @apiSuccess {String} redirectUrl 需要跳转到的地址
     * @apiSuccess {String} newPath 需要显示的目录路径
     *
     * @apiGroup Department_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/removedepartment',departmentRemovevm);
}
