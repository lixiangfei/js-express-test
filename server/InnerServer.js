/**
 * https://segmentfault.com/a/1190000008504535
 * http.createServer内部原理 
 *  Server继承net.Server,且requestListener,作为'request'事件的监听器
 * 
 * 在resOnFinish函数中，self.emit('request', req,res)触发request事件
 *  res来源
 *      var res = new ServerResponse(req);
 *  req来源
 *      1.req来自parserOnIncoming的形参
 *          parser.onIncoming = parserOnIncoming.bind(undefined, this, socket, state);
 *          而parser来自_http_common的parsers.alloc();
 *      2.在方法parserOnHeadersComplete中 skipBody = parser.onIncoming(parser.incoming, shouldKeepAlice)
 *          传入request
 *         parser.incoming = new IncomingMessage(parser.socket) 说明传入的request是
 *          IncomingMessage的实例
 *      3.IncomingMEssage = require('_http_incoming').IncomingMessage
 *          _http_incoming中可以看到util.inherites(IncomingMessage,Stream.Readable)
 *      所以IncomingMessage是继承自Stream.Readable
 *   什么时候执行回调
 *      1.connectionListener中有  parser.onIncoming = parserOnIncoming.bind(undefind, this, socket, state)
 *      2.在Server的初始化时
 *             this.on('request', requestListener)注册request时加上执行回调函数
 *             this.on('connection', connectionListener) 注册connection的Listener
 *      3.parserOnIncoming方法中，server.emit('request', req, res)发出request,最后在
 *       最后在parserOnHeadersComplete方法中调用onIncoming-->server的parserOnIncoming
 *      4.connection操作
 *          net.js中的onconnection方法中，selef.emit('connectio', socket)
 *      当server调用listen，会触发connectionListener,进一步触发
 *      parserOnIncoming,发出request和response，触发requestListener也就是传入的回调函数
 * */ 

 //http.js
 const Server = exports.Server = Server.Server;

 exports.createServer = function(requestListener){
     return new Server(requestListener);
 }

 function Server(requestListener){
     if(!(this instanceof Server)) return new Server(requestListener);

     net.Server.call(this, {allowHalfOpen:true});
     if(requestListener){
         this.addEventListener('request', requestListener);
     }
    this.httpAllowHalfOpen = false;
    this.addEventListener('connect', connectionListener);
    this.timeout = 2 * 60 * 1000;
    this._pendingResonpseData = 0;
 }

 util.inherits(Server, net.Server);

 Server.prototype.setTimeout = function(msecs, callback){
     this.timeout = msecs;
     if(callback){
         this.on('timeout', callback);
     }
     return this;
 }

 exports.Server = Server;

 /**
  * http.request方法
    http.request(options, callback)
    http.request(url,[,options][,callback])
        options 对象，包含以下参数
            protocol: 默认http:
            host: 请求的域名或ip地址，默认为localhost
            hostname:host的别名，为了支持url.parse,hostname优先使用
            port
            localAddress
            method
            path 请求相对于根的路径，默认是/app.js
            headers 请求头对象
            auth: Basic认证(基本身份认证)，这个值将被计算成请求头中的Authorization部分
            callback:回调，传递一个

  */