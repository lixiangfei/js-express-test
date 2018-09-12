var express = require('express');
var app = express();
var path = require('path');
//__dirname,保证运行在不同目录下，能找到模板文件
var resolve = fileName => path.resolve(__dirname, fileName);


//------------------------------------------------

//----------------------------------------------
//express中使用模板
 app.set('views', resolve('./views'));
 app.set('view engine','jade'); //可以不用谢模板后缀

//是一个特殊的路由方法，没有任何HTTP方法与之对应，它的作用是对于一个路径上的所有请求
//加载中间件， /secret的请求，不管使用GET,POST,PUT,DELETE或其他http模块支持的HTTP请求
//句柄都会得到执行
app.all('/secret', function(req, res, next){

});

/**
 * req.app获取中间件挂载的app的引用
 * req.baseUrl 返回实际的路径，不是配置的url
 * req.body request请求中包含键值对的数据，默认undefined,当使用body-parser,multer等body-parsing中间件时候有数值
 * req.cookies 默认为{},需要使用cookie-parser中间件处理
 * req.params  '/user/:name'  get /user/tj  req/params.name = tj
 * 
 */

 var bodyParser = require('body-parser');
 var multer = require('multer');
 app.use(bodyParser.json()); //for parsing application/json
 app.use(bodyParser.urlencoded({extended:true})); //application/x-www.form-urlencoded
 app.use(multer())// multipart/form-data


app.get('/', function(req, res) {
    res.render('index', {title:'Hey',message:'hello world'})
    // res.send('Hello World');


});
//POST请求
app.post('/index', function(req, res) {
    res.send('Hello World');
});

// /user 节点接受PUT请求
app.put('/user', function(req, res) {
    res.send('GOT a PUT request at /user');
});

app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user');
});

//路由路径： 
//
app.get('/ab?cd', function(req, res){

});

//利用Express 托管静态文件
// 利用Express内置的express.static可以方便地托管静态文件，比如图片，css,js等

//public路径下的文件可以通过 localhost:3000/xxx.js访问
app.use(express.static('public'));

app.use(express.static('files'));
//映射到虚拟路径localhost:3000/static/
app.use('/static', express.static('public'))
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(host, port);
    console.log('Example app listening at http://%s:%s', host, port);
});
