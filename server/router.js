/**
 * 路由(Routing)是由一个URI和一个特定的HTTP方法(GET,POST等)组成,涉及到应用如何响应客户端对某个网站节点
 * 的访问
 * 
 * 每一个路由都可以有一个或多个处理器函数，当匹配到路由时，这个/些函数将被执行
 * 
 * 路由的定义由以下结构组成 app.METHOD(PATH,HANDLER) 其中，app是一个express实例，
 * METHOD是某个HTTP的方法(get,post,head,options,delete,put等)
 * path是服务器端的路径，HANDLER是由当路由器匹配到需要执行的函数
 * 
 * path支持字符串，字符串
 * 
 * 路由路径 可以是字符串，字符串模式或者正则表达式
 */


 /**
  * 路由句柄
    可以为请求处理提供多个回调函数，其行为类似中间件。唯一的区别是这些回调函数有可能调用
    next('route')方法而略过其他路由回调函数。可以利用该机制为路由定义前提条件
  */

  
//创建莫跨话，可挂载的路由句柄
var express = require('express');
var app = express();

//app.route()创建路由路径的链式路由句柄，创建模块化路由
app.route('/book')
    .get(function(req, res){

    })
    .post(function(req, res){

    })

var router = express.Router();

//路由使用中间件
router.use(function timeLog(req, res, next){
    console.log(`time:${Date.now()}`);
    next();
});

// 定义网站主页的路由
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about', function(req, res) {
  res.send('About birds');
});
//应用即可处理发自 /birds 和 /birds/about 的请求，并且调用为该路由指定的 timeLog 中间件。
// app.use('/birds', router);
module.exports = router;

