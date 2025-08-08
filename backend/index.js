const http = require('http');
const express = require('express');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('A new socket has connected', socket.id)

    socket.on('sendMsg', (msg) => {
        console.log(msg)
    })
})

server.listen(8080, () =>  console.log('server is listening on port 8080'))