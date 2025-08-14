const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://192.168.18.41:5173',
        credentials: true,
        methods: ['GET', 'POST']
    }
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('A new socket connected:', socket.id);

    // Create room
    socket.on('createRoom', ({ room }) => {
        if (!rooms.has(room)) {
            rooms.set(room, [{ player: socket.id, playerSign: 'o' }]);
        }
        socket.join(room);
        io.to(socket.id).emit('roomCreated', 'o');
        console.log(`Room created: ${room}`, rooms.get(room));
    });

    // Search rooms
    socket.on('searchRooms', () => {
        io.to(socket.id).emit('rooms', [...rooms]);
    });

    // Join room
    socket.on('joinRoom', ({ roomName }) => {
        if (rooms.has(roomName) && !rooms.get(roomName).some(m => m.player === socket.id)) {
            rooms.get(roomName).push({ player: socket.id, playerSign: 'x' });
            socket.join(roomName);
            io.to(socket.id).emit('x', 'x');
            const players = rooms.get(roomName).map(m => m.player);
            io.to(players).emit('joinedRoom', { roomName, socketId: socket.id });
            console.log(`${socket.id} joined room: ${roomName}`);
        }
    });

    // Leave room
    socket.on('leaveRoom', ({ roomName }) => {
        socket.leave(roomName);
        if (rooms.has(roomName)) {
            if (rooms.get(roomName).length === 1) {
                rooms.delete(roomName);
            } else {
                rooms.set(roomName, rooms.get(roomName).filter(m => m.player !== socket.id));
            }
            console.log(`${socket.id} left room: ${roomName}`);
        }
    });

    // Update board
    socket.on('updateBoard', ({ board, room }) => {
        // Swap 1 ↔ 2
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 1) board[i] = 2;
            else if (board[i] === 2) board[i] = 1;
        }

        const roomMembers = rooms.get(room);
        if (!roomMembers) {
            console.error(`Room ${room} not found`);
            return;
        }

        // Find other player in the room
        const otherPlayer = roomMembers.find(m => m.player !== socket.id);
        if (!otherPlayer) {
            console.error(`Other player not found in room ${room}`);
            return;
        }

        // Send updated board only to the other player
        socket.to(otherPlayer.player).emit('boardUpdated', { board, room});
    });

    socket.on('getTurn', ({turn, room}) => {

        const otherPlayer = rooms.get(room).find(m => m.player !== socket.id);
        if(turn === 1) {
            io.to(socket.id).emit('turnChanged', { turn: 2 });
            io.to(otherPlayer.player).emit('turnChanged', { turn: 1 });
        } else if(turn === 2) {
            io.to(socket.id).emit('turnChanged', { turn: 1 });
            io.to(otherPlayer.player).emit('turnChanged', { turn: 2 });
        }
        return;
    });

    // Disconnect
    socket.on('disconnect', () => {
        // Clean up player from all rooms
        for (let [roomName, members] of rooms.entries()) {
            const filtered = members.filter(m => m.player !== socket.id);
            if (filtered.length === 0) {
                rooms.delete(roomName);
            } else {
                rooms.set(roomName, filtered);
            }
        }
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

server.listen(5000, "0.0.0.0", () =>
    console.log("Server is listening on port 5000")
);
