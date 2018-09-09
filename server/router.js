/**
 * 路由(Routing)是由一个URI和一个特定的HTTP方法(GET,POST等)组成,涉及到应用如何响应客户端对某个网站节点
 * 的访问
 * 
 * 每一个路由都可以有一个或多个处理器函数，当匹配到路由时，这个/些函数将被执行
 * 
 * 路由的定义由以下结构组成 app.METHOD(PATH,HANDLER) 其中，app是一个express实例，
 * METHOD是某个HTTP的方法(get,post,head,options,delete,put等)
 * path是服务器端的路径，HANDLER是由当路由器匹配到需要执行的函数
 */