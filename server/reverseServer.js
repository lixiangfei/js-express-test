const http = require('http');
const reverseProxy = require('./reverseProxy.js');

//创建反向代理服务器
function startProxyServer(port){
    return new Promise((resolve, reject)=>{
        const server = http.createServer(reverseProxy({
              //初始化参数
            servers:['127.0.0.1:3001','127.0.0.1:3002','127.0.0.1:3003']
        }));

        server.listen(port, ()=>{
            console.log(`反向代理服务器启动${port}`);
            resolve(server);
        });

        server.on('error', reject);
    })
}

/**
 * 该函数用来创建一个HTTP服务器，并将requestListener作为request事件的监听函数
 * http.createServer([requestListener])
 *  req 请求对象
 *  res 响应对象
 * 
 *  createServer-->内部创建Server实例，传入回调函数，并返回该实例
 *      Server继承net.Server,且requestListener作为request事件的监听器
 *      
 */
function startServer(port){
    return new Promise((resolve, reject)=>{
        const server = http.createServer(function(req, res){
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', ()=>{
                const buf = Buffer.concat(chunks);
                res.end(`${port} :${req.method} ${req.url} ${buf.toString()}`.trim());
            });
        });

        server.listen(port, ()=>{
            console.log(`服务器已启动：${port}`);
            resolve(server);
        });
        server.on('error', reject);
    });
}

//==================
function startServerV(port){
    return new Promise((resolve, reject) =>{
          var server = new http.Server();
          server.on('request', (req, res)=>{
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', ()=>{
                const buf = Buffer.concat(chunks);
                res.end(`${port} :${req.method} ${req.url} ${buf.toString()}`.trim());
            })
          });

          server.listen(port, ()=>{
              resolve(server);
          })

         server.on('error', reject);
    });
  
}

(async function(){
    await startServer(3001);
    await startServer(3002);
    await startServer(3003);
    await startProxyServer(3000);
})();

//学习地址  https://morning.work/page/nodejs/simple-http-reverse-proxy.html