const express = require('express');
const app = express();
const { createServer } = require('http');

const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(
    'send_message',
    (message) => (
      console.log(`Sent message: ${message}`),
      socket.broadcast.emit('receive_message', message)
    )
  );

  socket.on('disconnect', (reason) =>
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`)
  );
});

server.listen(3001, () => console.log('SERVER RUNNING'));
