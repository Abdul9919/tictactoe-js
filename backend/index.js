// server.js (only the socket-related parts shown/modified)
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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

    // Tell the creator their assigned sign
    io.to(socket.id).emit('playerAssigned', { room, playerSign: 'o' });

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

      // Tell the joining socket its assigned sign
      io.to(socket.id).emit('playerAssigned', { room: roomName, playerSign: 'x' });

      // Broadcast joinedRoom with players and their signs
      const playersInfo = rooms.get(roomName).map(m => ({ socketId: m.player, playerSign: m.playerSign }));
      const players = rooms.get(roomName).map(m => m.player);
      io.to(players).emit('joinedRoom', { roomName, players: playersInfo });

      console.log(`${socket.id} joined room: ${roomName}`, playersInfo);
    }
  });

  // Handle client asking "what's my sign?"
  socket.on('requestPlayerSign', ({ room }) => {
    const roomMembers = rooms.get(room);
    if (!roomMembers) {
      io.to(socket.id).emit('playerAssigned', { room, playerSign: null });
      return;
    }
    const member = roomMembers.find(m => m.player === socket.id);
    if (member) {
      io.to(socket.id).emit('playerAssigned', { room, playerSign: member.playerSign });
    } else {
      io.to(socket.id).emit('playerAssigned', { room, playerSign: null });
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

  // Update board (unchanged but kept for context)
  socket.on('updateBoard', ({ board, room }) => {
    const players = rooms.get(room).map(m => m.player);
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    console.log(board);

    const roomMembers = rooms.get(room);
    if (!roomMembers) {
      console.error(`Room ${room} not found`);
      return;
    }

    const otherPlayer = roomMembers.find(m => m.player !== socket.id);
    if (!otherPlayer) {
      console.error(`Other player not found in room ${room}`);
      return;
    }

    for (const [a, b, c] of winPatterns) {
      if (board[a] === 'O' && board[b] === 'O' && board[c] === 'O') {
        io.to(players).emit('gameWon', { player: 'o' });
        console.log('Player o has won the game!');
      } else if (board[a] === 'X' && board[b] === 'X' && board[c] === 'X') {
        io.to(players).emit('gameWon', { player: 'x' });
        console.log('Player x has won the game!');
      }
    }

    socket.to(otherPlayer.player).emit('boardUpdated', { board, room });
  });

  socket.on('getTurn', ({ turn, room }) => {
    const otherPlayer = rooms.get(room).find(m => m.player !== socket.id);
    if (turn === 'o') {
      if (otherPlayer) io.to([otherPlayer.player, socket.id]).emit('turnChanged', { turn: 'x' });
    } else if (turn === 'x') {
      if (otherPlayer) io.to([otherPlayer.player, socket.id]).emit('turnChanged', { turn: 'o' });
    }
    return;
  });

  // Disconnect cleanup
  socket.on('disconnect', () => {
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
