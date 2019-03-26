//后端
module.exports={
    manageRoutes:function(app){
        let allRoute=[
            'login','position','admin','user','log',
            'admin','department','position','main'
        ];
        //调用所有的路由
        allRoute.forEach((item)=>{
            require('./'+item)(app);
        });

        //githup webhooks event func
        app.post('/autoBuild',require(dirlist.viewModelPath+'autoBuild'));

    }
}

