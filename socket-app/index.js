var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
    socket.on('disconnect', function () {
        io.emit('disconnect');
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});