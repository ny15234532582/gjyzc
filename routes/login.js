const vmbase = '../viewModels/login/';

const loginGet = require(vmbase+'loginGet');
const loginPost = require(vmbase+'loginPost');
const firlogboo = require(vmbase+'firstLoginBool');
const logout = require(vmbase+'logout');

module.exports=function(app){

    /**{{{ * 获取当前页面
     *
     * @api {GET} /manage 获取用户登陆页面
     * @apiDescription 获取用户登陆页面
     *
     * @apiSuccess {Page} html 直接返回管理端登陆页
     *
     * @apiGroup Login_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage',loginGet);

    /**{{{ * 提交登陆数据
     *
     * @api {POST} /manage 用户登陆
     * @apiDescription 用户登陆系统
     *
     * @apiParam (body参数) {String} userName 用户帐号
     * @apiParam (body参数) {String} password 用户密码
     *
     * @apiSuccess {Boolean} msg 用于客户端的显示数据
     * @apiSuccess {Boolean} status 是否登陆成功
     *
     * @apiGroup Login_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage',loginPost);

    /**{{{ * 检测用户是否为首次登陆
     *
     * @api {POST} /manage/firstLoginBool 判断是否为第一次登陆本系统
     * @apiDescription 判断是否为第一次登陆本系统，如果是，则提示，此次用户此次输入的密码将用于以后登陆
     *
     * @apiParam (body参数) {String} userName 用户帐号
     *
     * @apiSuccess {Boolean} status 是否查询成功
     * @apiSuccess {Boolean} isUserFirstLogin 如果为true，则为第一次登陆
     *
     * @apiGroup Login_Route
     * @apiVersion 1.0.0
     *///}}}
    app.post('/manage/firstLoginBool',firlogboo);

    /**{{{ * 注销登陆
     *
     * @api {GET} /manage/logout 注销登陆
     * @apiDescription 直接访问此url路径，则当前用户退出
     *
     * @apiSuccess {redirect} data 直接跳转到登陆页
     *
     * @apiGroup Login_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/logout',logout); 

}
