const express = require('express');
const app = express();
const { createServer } = require('http');

const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors);

const server = createServer(app);

const users = [];

const addUser = (id, username) => {
  const multipleUser = users.find((user) => user.username === username);
  if (multipleUser) {
    return { error: 'Username is taken. Choose a new one' };
  }
  const user = { id, username };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const removedUser = users.find((user) => user.id === id);
  users.splice(users.indexOf(removedUser), 1);
};

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('login', (userName) => {
    socket.emit('logged_in', addUser(socket.id, userName));
    socket.broadcast.emit('receive_message', {
      serverMessage: userName + ' joined the chat',
    });

    console.log('users: ', users);
  });

  socket.on(
    'send_message',
    (obj) => (
      console.log(`Sent message: ${obj.message}`),
      socket.broadcast.emit('receive_message', obj)
    )
  );

  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
    const removedUser = users.find((user) => user.id === socket.id);
    removeUser(socket.id);
    removedUser &&
      socket.broadcast.emit('receive_message', {
        serverMessage: removedUser.username + ' disconnected',
      });
  });
});

server.listen(3001, () => console.log('SERVER RUNNING AT PORT 3000'));
