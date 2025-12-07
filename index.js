const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    let username = 'Guest'; // Default username until registered
    socket.on('register', (name) => {
        username = name;
        socket.username = name; // Store the username directly on the socket object
        console.log(`User ${socket.username} connected.`);
        io.emit('user connected', socket.username); // Announce the new user to everyone
    });
    console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
