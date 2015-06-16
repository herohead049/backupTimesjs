var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connect', function(data){ 
    console.log('got something',data);
    
    /* … */ });
server.listen(3000);