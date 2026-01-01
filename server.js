const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Listen for when a user sets their name
    socket.on('new-user', (username) => {
        socket.username = username;
        // Broadcast to everyone else that a new user joined
        socket.broadcast.emit('user-connected', username);
    });

    socket.on('chat message', (data) => {
        // Send the message along with the sender's username
        io.emit('chat message', {
            username: socket.username,
            message: data
        });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            socket.broadcast.emit('user-disconnected', socket.username);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});