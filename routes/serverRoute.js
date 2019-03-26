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
	app.get('auto_build',function(req,res,next){
            console.log('nihao,keyilemasdf');
	});
    }
}

