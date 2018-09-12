//使用内置HTTP实现的反向代理

const http = require('http');
const assert = require('assert');

module.exports = function reserseProxy(options){
    assert(Array.isArray(options.servers),"options.servers 为数组");
    assert(options.servers.length > 0,"options.servers长度大于0");

    //解析服务器地址，生成hostname 和 port
    const servers = options.servers.map(str=>{
        const cfg = str.split(':');
        return {hostname:cfg[0], port:cfg[1] || '80'};
    });

    let ti = 0;
    function getTarget(){
        const t = servers[ti++];
        ti = ti % servers.length;
        return t;
    }

    //生成监听error事件函数，出错时响应 500
    function bindError(req, res, id){
        return function(err){
            const msg = String(err.stack || err);
            console.log(`${id} 发生错误：${msg}`);
            if(!res.headersSent){
                res.writeHead(500, {'content-type':'text/plain'});
            }
            res.end(msg);
        }
    }


    return function proxy(req, res){
        //生成代理请求信息
        const target = getTarget();
        const info = {
            ...target,
            method:req.method,
            path:req.url,
            headers:req.headers
        };

        const id = `${req.method} ${req.url} => ${target.hostname}:${target.port}`;
        console.log(`${id} 代理请求`);
        
        //发送代理请求
        const proxyReq = http.request(info, proxyRes=>{
            proxyRes.on('error', bindError(req, res, id));
            console.log(`${id} 响应: ${proxyRes.statusCode}`);
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });
        req.pipe(proxyReq);
        proxyReq.on('error', bindError(req, res, id));

        /**
            var postData= {};
            proxyReq.write(postData);
            proxyReq.end();
         */
    }
};
