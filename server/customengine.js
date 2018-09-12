var express = require('express');

var app = express();
var fs = require('fs');

//ext, cb
app.engine('ntl', function(filePath, options, callback){
    fs.readFile(filePath, function(err, content){
        if(err) return callback(err, content);

         var rendered = content.toString().replace('#title#', '<title>'+ options.title +'</title>')
        .replace('#message#', '<h1>'+ options.message +'</h1>');
        return callback(null, rendered);
    });
});

app.set('views','./views');//指定视图所在的位置
app.set('view engine', 'ntl'); //注册模板引擎

/**
 * .ntl
 * 
 * #title#
 * #message#
 * 
 */