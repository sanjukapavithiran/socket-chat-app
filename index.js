const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


let users = {};


io.on('connection', (socket) => {
    console.log('A user connected');

 
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;
        io.emit('user list', Object.values(users));
     
        io.emit('user connected', nickname);
    });

 
    socket.on('chat message', (msg) => {
        io.emit('chat message', { user: users[socket.id], msg });
    });

 
    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete users[socket.id];
        io.emit('user list', Object.values(users));
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
