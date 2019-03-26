const path=require('path');
const vmBase=path.join(__dirname,'../viewModels/')

const vmOnlist=require(vmBase+'chatOnline');
const vmOnlistPage=require(vmBase+'chatOnlinePage');

module.exports=(app)=>{

    /**{{{ * 返回用户列表面板 
     *
     * @api {GET} /chatOnline 获取用户列表面板
     * @apiDescription 返回当前在线的用户面板进行聊天系统的初始化         *
     *
     * @apiSuccess {Array} html 聊天系统的面板Html代码
     *
     * @apiGroup plugins_chatOnline_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/chatOnline',vmOnlist);

    /**{{{ * 返回与单个客户的聊天面板
     *
     * @api {GET} /chatOnline/nowOnline/ 获取与特定客户的聊天面板
     * @apiDescription 获取当前在线的用户
     *
     * @apiParam (query参数) {String} path 当前目录路径，目录之间以/分隔
     *
     * @apiSuccess {Array} lowFolder 获取当前在线的用户
     *
     * @apiGroup plugins_chatOnline_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/chatOnline/chatOnlinePage',vmOnlistPage);

}
