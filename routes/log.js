const logShow = 
    require(dirlist.viewModelPath+'log/logShow');

//日志操作
module.exports=function(app){

    /**{{{ * 获取日志
     *
     * @api {GET} /manage/log/:logType/:pageNum 获取特定页的日志类型
     * @apiDescription 获取特定类型和片段的日志
     *
     * @apiParam (query参数) {String} onepageNum 单页条数
     * @apiParam (param参数) {String} logType 需要查看的日志类型
     * @apiParam (param参数) {String} pageNum 需要查看的日志页码
     *
     * @apiSuccess {Html} data 当前日志页的html代码，用于$('main').html(data);
     *
     * @apiGroup Log_Route
     * @apiVersion 1.0.0
     *///}}}
    app.get('/manage/log/:logType/:pageNum',logShow);

}
