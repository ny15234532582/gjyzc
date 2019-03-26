const dataSecUser=
    require(dirlist.dataSecPath+'user');

module.exports=function(req,res,next){

    //如果检测已经登陆，则直接跳转到后台首页
    if(req.session.userId) 
        return res.redirect(303,'/manage/admin');

    //如果系统需要初始化，则初始化系统
    isSystemInit()
    .then((loginfoLet)=>{

        //用户提示信息
        let loginfo='请输入帐号和密码';
        let user='';

        //系统初始创建Admin账户
        if(loginfoLet){
            loginfo=loginfoLet;
            user='admin'; }

        //返回登陆页
        return res.render('login',{
            layout:null,
            loginfo:loginfo }); 

    });
}

async function isSystemInit(){
/*检测系统是否需要初始化{{{*/
    let msg='';
    try{ 
        //创建admin用户
        let isInit=await dataSecUser.createAdmin();

        //返回提示信息
        if(isInit){ 
            msg='<span '+
            'style="color:#fff;font-weight:bold;font-size:13px;">'+
            '欢迎使用本系统,'+
            '因本系统处于初始化状态，'+
            '现已创建admin超级管理权限帐号,请您输入初始密码,'+
            '此密码将会用于您以后登陆，请慎重'+'</span>'; 
        }
    }catch(err){
        msg='<span '+
        'style="color:#fff;font-weight:bold;font-size:13px;">'+
        '系统初始化失败，请联系管理员</span>'; 
    }
    return msg;
} 
/*检测系统是否需要初始化}}}*/

