

/**
 * Node.js中的HTTP接口被设计成支持协议的许多特性。比如，大块编码的信息。这些接口不缓冲完整的请求或响应，用户
 * 能够以流的形式处理数据
 * 
 * HTTP消息头由一个对象表示,键名是小写，键值不能修改
 * 为了支持各种可能的HTTP应用，Node.js的HTTP API是非常底层的。它只涉及流处理与消息解析。
 * 它把一个消息解析成消息头和消息主体，但不解析具体的消息头或消息主题。
 * {
 *  'content-length':'123',
 *  'content-type':'text/plain',
 *  'connection':'keep-alive',
 *  'host':'mysite.com',
 *  'accept':''
 * }
 * 
 * 接收到的原始消息头保存在 rawHeaders属性中，它是一个[key, value, key2, value2,...]数组。
 */

 /**
  * http.Agent
    Agent负责为HTTP客户端管理连接的持续与复用。它为一个给定的主机和端口维护着一个等待请求的队列，且为每个请求重复使用一个
    单一的socket连接直到队列为空，此时socket会被销毁或被放入到一个连接池中，在连接池中等待被有着相同主机与端口的请求再次使用。
    是否被销毁或被放入连接池取决于keepAlive选项。
  */

  /**
   * http.ClientRequest
   *    该对象在http.request内被被创建并返回。它表示着一个正在处理的请求，其请求头已进入队列。请求头仍可使用setHeader(n,v),
   *    getHeader(n)和removeHeader(n) API进行修改。实际的请求头会与第一个数据块一起发送或当调用request.end时发送。
   *    
   *    要获取相应，需为'response'事件添加一个监听器到请求对象。当响应头被接收到时，‘response’事件会从请求对象上被处罚。
   *    ‘response’事件被执行时带一个参数，该参数是一个http.IncomingMessage实例
   * 
   *    在response事件期间，可以添加监听到相应对象上，比如监听data事件
   * 
   *    如果没有添加response事件处理函数，则响应会被整个丢弃。如果添加了response事件处理函数，则鼻息消耗完响应对象的
   *    数据，则通过调用response.read()或者添加一个data事件处理函数或调用resume方法。数据被消耗完时触发end事件。在数据被
   *    读取之前会消耗内存，可能会造成 process out of memory错误。
   * 
   *    NOTE:Node.js不会检查Content-Length与已传输的请求主体的长度是否相等。
   *    该请求实现了  可写流 接口，它是一个包含以下事件的EventEmitter
   * 
   */

   const http = require('http');
   const net = require('net');
   const url = require('url');

   //connect事件

   //创建HTTP代理服务器
   const proxy = http.createServer((req, res) => {
       res.writeHead(200, {'Content-Type':'text/plain'});
       res.end('okay');
   })

   proxy.on('connect', (req, cltSocket, head) => {
       //连接到一个服务器
       const srvUrl = url.parse(`http://${req.url}`);
       const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, ()=>{
           cltSocket.write('HTTP/1.1 200 Connection Established\r\n' + 
                            'Proxy-agent:Node.js-Proxy\r\n' + '\r\n');
           srvSocket.write(head);
           srvSocket.pipe(cltSocket);
           cltSocket.pipe(srvSocket);
       })
   });

   //当server开始监听，'listening'事件会触发。callback将会被添加为listening事件的监听器
   proxy.listen(1337, '127.0.0.1', ()=>{
       //发送请求到代理服务器
       const options = {
           port: 1337,
           hostname:'127.0.0.1',
           method:'CONNECT',
           path:'www.google.com:80'
       };

       const requ = http.request(options);
       req.end();

       req.on('connect', (res, socket, head) => {
           console.log('已连接');

           //通过代理服务器发送一个请求
           socket.write('GET / HTTP/1.1\r\n' + 'Host:www.google.com:80\r\n' + 'Connection:close\r\n'+'\r\n');
           socket.on('data', (chunk)=>{
               console.log(chunk.toString());
           });
           socket.on('end', ()=>{
               proxy.close();
           })
       })
   });