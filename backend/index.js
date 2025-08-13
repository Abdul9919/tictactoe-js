const http = require('http');
const express = require('express');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://192.168.18.41:5173',
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const connectedUsers = new Map()

const rooms = new Map()

io.on('connection', (socket) => {
    console.log('A new socket has connected', socket.id)

    socket.on('socketName', (data) => {
        if(!connectedUsers.has(socket.id)){
            connectedUsers.set(socket.id, data.name )
            console.log(connectedUsers)
        }
    })

    socket.on('createRoom', ({room, members}) => {
        if (!rooms.has(room)){

            rooms.set(room, members)
        }
        socket.join(room);
        console.log(`Room created: ${room} with members: ${members}`);
    })
    socket.on('searchRooms', (name) => {
       io.to(socket.id).emit('rooms', [...rooms]);     
     })

    socket.on('joinRoom', ({ roomName, name }) => {
        if (rooms.has(roomName) && !rooms.get(roomName).includes(name)) {
            rooms.get(roomName).push(name);
            socket.join(roomName);
            socket.emit('joinedRoom', { roomName, name });
            console.log(`${name} joined room: ${roomName}`);
        }
    });
    socket.on('leaveRoom', ({roomName}) => {
        socket.leave(roomName);
        if (rooms.has(roomName)) {
            if (rooms.get(roomName).length === 1) {
                rooms.delete(roomName);
            } else {
                rooms.set(roomName, rooms.get(roomName).filter(member => member !== connectedUsers.get(socket.id)));
            }
            console.log(`${connectedUsers.get(socket.id)} left room: ${roomName}`);
        }
    })

    socket.on('updateBoard', ({board, room}) => {
        socket.to(room).emit('boardUpdated', board);
    })
 
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
    })
});
server.listen(5000, "0.0.0.0", () =>
  console.log("Server is listening on port 5000")
);