import http from 'http';
var routing = require('./BookRouting');
var url = require('url');
var net = require('net');
var eventmodule = require('./EventHandlerModule');
var querystring = require('querystring');
var module = require('./DBModule');
function onRequest(request,response){
    if(request.url === '/favicon.ico'){
        response.writeHead(200,{"Content-Type":"image/x-icon"});
        response.end();
        return;
    }
    else{
        var url_parts = url.parse(request.url);
        routing.enableRoute(url_parts, request, response);
    }
}
var server1 = http.createServer(onRequest);
server1.listen(3000);
var server = net.createServer(function(c){
    console.log("Client connected");
    c.on('data',function(data){
        c.write(data);
    });
    c.on('close',function(c){
        console.log("Client disconnected");
    });
});
server.listen(1234,function(){
    console.log("TCP server started");
});
console.log("Server started. Try to access using browser");