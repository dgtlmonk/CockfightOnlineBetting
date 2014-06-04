
var CONN_PORT  = 8081; // port to listen
var io = require('socket.io').listen(CONN_PORT);

io.sockets.on('connection', function (socket) {
// socket.emit('hello',{ })
  console.log('connection detedted ...');
});
