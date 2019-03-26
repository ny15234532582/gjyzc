const artfileDataSec=require('../../dataSecurity/artfile');

module.exports=function(req,res,next){

    if(req.xhr){
        //需要传给文章编辑页面的参数
        let pageParam={ layout:null }

        //查看是否有此篇文章,并设定不同的页面参数
        artfileDataSec.findArticle({
            userId:req.session.userId,
            path:req.session.showPath,
            fileName:req.body.filename })
        /*设置传递给页面的参数{{{*/
        .then((article)=>{
            //显示文章修改页面
            return res.render('plus/cms/article-Edit',article); 
        /*设置传递给页面的参数}}}*/
        },(err)=>{
            //跳转到当前栏目页面
            return res.json({
                status:true,
                redirectUrl:'/manage/artFolder',
                newPath:req.session.showPath});
        });

    }else next(); 
}

