const admin = require('../viewModels/admin');

//后台管理首页
module.exports=function(app){

    /**{{{ * 拦截帐号
     *
     * @api {ALL} /manage/* 拦截未登陆帐号
     * @apiDescription 如果req.session.userId为空，则跳转至登陆页
     * @apiGroup Admin_route
     * @apiVersion 1.0.0
     * @apiPrivate
     *///}}}
    app.use('/manage/*',function(req,res,next){
        if(req.session.userId) return next(); 
        else return res.redirect(303,'/manage'); 
    }); 

    /**{{{ * 管理端首页
     *
     * @api {GET} /manage/admin 管理页首页
     * @apiDescription 管理页首页，当登陆后直接跳转到该页面。
     * @apiGroup Admin_route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/admin',admin); 

}

