// chat server
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

    app.set('port', process.env.PORT || 5001);
    app.use('/static',express.static(__dirname + '/public'));
    app.use('/admin',express.static(__dirname + '/admin'));



server.listen( app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

app. get('/', function(req, res){
    res.sendfile(__dirname + '/adminchat.html');
});

 var usernames = {};


/*
    console.log('------------------');
    console.log('user_' + Math.floor(Math.random() * 100)+1);
    console.log('-----------------');
*/

 io.sockets.on('connection', function(socket){

    socket.emit('identifyClient'); // ask client to identify
    socket.on('clientIdentifiedAs', function (username){
        console.log('client identified as: ' + username );
        if (usernames[username]) {
                console.log('SERVER: WARNING user ' + username + ' already logged in');
                socket.emit('updatechat', 'SERVER','Connection rejected. Duplicate user detected.', false);
                socket.disconnect();
        } else {
            console.log(username + ' :: New user detected. Access granted, ');
            usernames[username] = username;
            socket.username = username;
            socket.emit('updatechat','SERVER',' Connected as ' + username, true);
            io.sockets.emit('updatechat','SERVER', username + ' has joined the chat.');
            io.sockets.emit('updateusers', usernames);
        }
    });


    // client emits 'sendchat'
    socket.on('sendchat', function( data ){
        io.sockets.emit('updatechat', socket.username, data);
    });


    // client disconnect
    socket.on('disconnect', function(){
    try {

        if (!socket.username) return;
        // remove the username from global usernames list
            delete usernames[socket.username];

        // update list of users in the chat, client-side
        io.sockets.emit('updateusers',usernames);

        // echo, globally that this client left the chat
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected.');
        } catch (e) {

        }
    });



});
