var Hapi = require('hapi');
var cdlibjs = require('cdlibjs');
var redis = require('redis');


var redisServer = cdlibjs.getRedisAddress();

var redisClient = redis.createClient(6379, redisServer);


var server = new Hapi.Server();
server.connection({ port: 4000 });

fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// start of sockets

var io = require('socket.io')(server.listener);

io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    //socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    //sendTime();
    //socket.on('i am client', console.log);

    socket.on('button', function (data) {
        console.log(data);
        io.emit('button', data);
    });
});

// end of sockets

server.route({
    method: 'GET',
    path: '/{data}',
    handler: function (request, reply) {
        //reply.continue(200, {'Content-Type': 'text/html'});
        io.emit('wait', { message: "Retrieving Data please wait"});
//        console.log(request.params.data);
        setTimeout(function() {
            sendTime(request.params.data);
            io.emit('wait', { message: "retrieved Data"});
        },1000);
        reply(index.toString());
        
    }
});

function sendTime(reqData) {
  /**
    if (reqData === 'ch00sm33') {
        io.emit('client', { client: "ch00sm33", description: "Networker Server", owner: "Craig David"});
    } else {
        io.emit('client', { client: "us01s-epm04", description: "Hyperion Server", owner: "Deb David"});
    }

  **/

    redisClient.hget("bf.server", reqData, function(err, reply) {
        io.emit('client', JSON.parse(reply));
        console.log(reply);
    });
}


redisClient.hset("bf.server", "ch00sm33" , '{ "client": "ch00sm33", "description": "Networker Server", "owner": "Craig David", "backuprequired": "true", "ffrs": "false" }');
redisClient.hset("bf.server", "us01s-epm04" , '{ "client": "us01s-epm04", "description": "Hyperion Server", "owner": "Deb David", "backuprequired": "true", "ffrs": "true" }');
redisClient.hset("bf.server", "us01s-epm05" , '{ "client": "us01s-epm05", "description": "Hyperion Server", "owner": "Deb David", "backuprequired": "true", "ffrs": "true" }');
redisClient.hset("bf.server", "us01s-epm06" , '{ "client": "us01s-epm06", "description": "Hyperion Server", "owner": "Deb David", "backuprequired": "true", "ffrs": "true" }');
redisClient.hset("bf.server", "us01s-epm07" , '{ "client": "us01s-epm07", "description": "Hyperion Server", "owner": "Deb David", "backuprequired": "true", "ffrs": "true" }');
redisClient.hset("bf.server", "us01s-epm08" , '{ "client": "us01s-epm08", "description": "Hyperion Server", "owner": "Deb David", "backuprequired": "true", "ffrs": "true" }');



server.start();
