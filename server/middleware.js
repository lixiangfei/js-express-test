
//------------------express是一个自身功能极简，完全是由路由和中间件构成的一个web开发框架
//从本质上说，一个express应用就是在调用各种中间件

/**
 * 中间件是一个函数，它可以访问请求对象 req, 响应对象res和web应用中处于
 * 请求-响应循环流程中的中间件，一般被命名为next的变量
 * 
 * 中间件的功能
 *  1.执行任何代码
 *  2.需改请求和响应对象
 *  3.终结请求-响应循环
 *  4.调用堆栈中的下一个中间件
 * 
 * 如果当前中间件没有终结请求-响应循环，则必须调用next方法将控制权交给下一个中间件，否则请求就会刮起
 * 
 * Express应用中可使用如下几种中间件
 * 1.应用级中间件
 * 2.路由级中间件
 * 3.错误处理中间件
 * 4.内置中间件
 * 5.第三方中间件
 */

 var express = require('express');

 var app = express();

 //应用级中间件绑定app对象，使用app.use()和app.METHOD()
 //没有挂载路径的中间件,应用的每个请你供求都会执行该中间件
 app.use(function(req, res, next){
    console.log(`time:${Date.now()}`);
    next();
 });

 //挂载至 /user/:id的中间件，任何指向/user/:id的请求都会执行
 app.use('/user/:id', function(req, res, next){
    console.log(`request type: ${req.method}`);
    next();
 });

 //路由和句柄函数(中间件系统)，处理get
 app.get('/user/:id', function(req, res, next){
    res.send('USER');
 });


 //在一个挂载点装载一组中间件
 app.use('/user/:id', function(req, res, next){
     console.log(`Request url: ${req.originalUrl}`);
        next();
    }, function(req, res, next){
        console.log(`Request Type: ${req.method}`);
    });
//作为中间系统的路由句柄，使得路径定义多个路由成为可能，下面定义了两个路由
//第二个路由不会被调用，因为第一个路由已经终止了请求-响应循环
// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// 处理 /user/:id， 打印出用户 id
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});


//如果需要在中间件栈中跳过剩余中间件，调用next('route')方法将控制权交给下一个路由
//next('route')支队使用app.VERB()或router.VERB()加载的中间件有效

app.get('/user/:id',function(req, res, next){
    if(req.params.id === 0) next('route');
    else next();
}, function(req, res, next){
    //渲染常规页面
    res.render('regular')
})

app.get('/user/:id',function(req, res, next){
    res.render('special');
});


//---------路由中间件-------
//路由中间件和应用级中间件一样，只是它绑定的对象是express.Router()
//路由级使用 router.use() 或 router.VERB() 加载。
var router = express.Router();

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
router.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0) next('route');
  // 负责将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('regular');
});

// 处理 /user/:id， 渲染一个特殊页面
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.render('special');
});
// 将路由挂载至应用
app.use('/', router);


//----------错误中间件
//错误中间件有四个参数，定义错误处理中间件必须使用4个参数，也必须在签名中声明next，计时不需要用到，否则中间
//件会被识别为一个常规中间件，不处理错误
app.use(function(err, req, res,next){
    console.error(err.stack);
  res.status(500).send('Something broke!');
});

//------------------内置中间件--------------------------------

//express.static(root, [options])
//express.static是Express唯一内置的中间件，它基于server-static,负责在Express应用中
//托管静态资源


//--------------------------第三方中间件-------------------
