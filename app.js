var express = require('express'),
    // https://github.com/mikeal/request
    req = require('request'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

    app.set('port', process.env.PORT || 3000);
    app.use('/static',express.static(__dirname + '/public'));
    app.use('/admin',express.static(__dirname + '/admin'));
    app.set('cfc_endpoint','http://120.28.67.93/sabong/sabong_v2.cfc?');
    // console.log(' cfc endpoint: '+ app.get('cfc_endpoint'));


server.listen( app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    // console.log(userData);
});

// app.use(express.bodyParser());

app.get('/', function(req, res){
    res.sendfile(__dirname + '/app.html');
});

// cache data coming from CFC or any remoting /data source
var globalData = {
            "roomName":"Sabong Online",
            "activeUsers":"70",
            "potAmount":"45,000",
            "description":"online cockfight 2014"
        }


var userData  = {
            "id":"23",
            "username":generateName(),
            "balance":"2500"
}


function generateName()  {
    return "user_" + Math.floor(Math.random()*100 +1);
}

 // req.defaults({ json:true })
// req('http://120.28.67.93/sabong/sabong_v2.cfc?method=placeBet&betType=BM_L_10_9&betAmount=100', onCFCData);

function placeBet( sType, nAmount ) {

}

// generate and returns dummy user data
// TODO: Connect to CFC
function getUserData() {
  return {
        "id": Math.floor(Math.random() * 100 + 1),
        "username": generateName(),
        "balance":2500
  }
}


function onCFCData ( err, res, body ) {
    if (!err && res.statusCode == 200) {
         json = JSON.parse(body);
        console.log(json.betType);

    } else {
        console.log('error loading data from cfc')
    }
}


users = {};

io.sockets.on('connection', function(socket){

        // request client to identify
        //socket.emit('identifyClient'); // TODO

        socket.on('clientIdentifiedAs', function(){

        });

        socket.emit('updateUserData', getUserData() );

       // getNews client request
       socket.on('clientGetNews', function(){
            socket.emit('serverGotNews','#Server# Sabong Online News payload string ...');
        });

      socket.on('clientGetSomeData', function(){
           socket.emit('serverGotSomeData', 'I am a new data too! ...');
      });

      socket.on('requestServerDataUpdate', function( newData ){
        console.log('#Server#  @requestServerDataUpdate ');
      });

      socket.on('onDataUpdate', function(data){
           console.log('#Data Updated ----#\n'+ data);
           globalData = data;
           io.sockets.emit('onServerGlobalData', globalData);

      });

    socket.emit('onServerGlobalData', globalData);


});


