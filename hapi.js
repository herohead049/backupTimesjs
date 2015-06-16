var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 4000 });

fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');



var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {

    socket.emit('Oh hii!');

    socket.on('burp', function () {
        socket.emit('Excuse you!');
    });
});

server.route({
    method: 'GET',
    path: '/{data}',
    handler: function (request, reply) {
        //reply.continue(200, {'Content-Type': 'text/html'});
        io.emit('wait', { message: "Retrieving Data please wait"});
        console.log(request.params.data);
        setTimeout(function() {
            sendTime(request.params.data);
            io.emit('wait', { message: "retrieved Data"});
        },1000);
        reply(index.toString());
        
    }
});

//console.log(index);

server.start();

function sendTime(reqData) {
    if (reqData === '1') {
        io.emit('client', { client: "ch00sm33", description: "Networker Server", owner: "Craig David"});
    } else {
        io.emit('client', { client: "us01s-epm04", description: "Hyperion Server", owner: "Deb David"});
    }
    //io.emit('extra',{ time: "here is something else"});
}

// Send current time every 10 secs
//setInterval(sendTime, 10000);
//sendTime;
// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    //sendTime();
    socket.on('i am client', console.log);
});

