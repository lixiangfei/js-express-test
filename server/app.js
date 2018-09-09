var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World');
});
//POST请求
app.post('/', function(req, res) {
    res.send('GOT a POST request');
});

// /user 节点接受PUT请求
app.put('/user', function(req, res) {
    res.send('GOT a PUT request at /user');
});

app.delete('/user', function(req, res) {
    res.send('Got a DELETE request at /user');
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