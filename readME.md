express学习 + 代理

###正向代理
    正向代理类似一个跳板机，代理访问外部资源

    客户端      <------>     正向代理  <-------->   互联网
    客户端必须设置正向代理服务器，要知道代理服务器的IP地址还有代理的端口。

    总的来说，正向代理，是一个位于客户端和原始服务器之间的服务器，为了从原始服务器取得内容，客户端向代理服务器发送一个请求并指定目标，然后代理向原始服务器转交请求并将活得的内容返回给客户端。客户端必须进行一些特别的设置才能使用正向代理

    作用：
        1.访问原来无法访问的资源，翻墙
        2.可以做缓存，加速访问资源
        3.对客户端访问授权，上网进行认证

### 反向代理
    反向代理(Reverse Proxy)实际运行方式是指以代理服务器来接受internet上的连接请求，然后将请求转发发给内部网络上的服务器，并将从服务器上得到的及诶过返回给internet上请求连接的客户端。此时，代理服务器对外就表现为一个服务器。


                   --------------------------------------                 
    客户端         | 反向代理服务器           web服务器    |
                   --------------------------------------                 
    作用
        1.保证内网的安全，可以使用反向代理提供WAF功能，防止web攻击
        2.负载均衡，通过反向代理服务器来优化网站的负载

### 比较
    正向代理中，proxy和client同于一个LAN，对server透明
    反向代理中，proxy和server同于一个LAN，对client透明

### node读取文件
    to learn