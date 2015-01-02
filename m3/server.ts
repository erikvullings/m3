import express  = require('express');
import path     = require('path');
import store    = require('./Services/Store');
import scanner  = require('./Services/TmbdMovieScanner');
import socketio = require('socket.io');

var app = require('express')();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' === app.get('env')) {
//    app.use(express.errorHandler());
//}

var movieScanner = new scanner.TmbdMovieScanner();
movieScanner.movieScanner('movies', 'e:/Movies/Movies');
app.get('/data/movies.json', function (req, res) {
    res.send(JSON.stringify(store.movieCollection));
});

var server = require('http').createServer(app);
var io: socketio.SocketManager = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.broadcast.emit('user connected');

    socket.on('message', function (from, msg) {
        console.log('recieved message from', from, 'msg', JSON.stringify(msg));
        console.log('broadcasting message');
        console.log('payload is', msg);
        io.sockets.emit('broadcast', {
            payload: msg,
            source: from
        });
        console.log('broadcast complete');
    });
});

server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
