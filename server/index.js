const express = require('express');
const app = express();
const { createServer } = require('http');

const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors);

const server = createServer(app);

const chatConfig = require('./chat-config');
const { users, addUser, removeUser } = require('./users');

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const sigintHandler = () => {
  console.log('SIGINTHANDLER!!!');
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  let inactivityTimer;

  socket.on('login', (userName) => {
    // try {
    const userDetails = addUser(socket.id, userName);
    socket.emit('logged_in', userDetails);
    io.emit('users', { users });
    console.log('users: ', users);
    // } catch (error) {}
  });

  socket.on(
    'send_message',
    (obj) => (
      console.log(`Sent message: ${obj.message}`),
      clearTimeout(inactivityTimer),
      // create error message helper function
      (inactivityTimer = setTimeout(() => {
        io.emit('alert_message', {
          alertMessage: `${obj.userName} was disconnected due to inactivity`,
        });
        socket.emit('inactive');
        socket.disconnect();
      }, chatConfig.inactivityTimer)),
      socket.broadcast.emit('receive_message', obj)
    )
  );

  socket.on('reload_userList', () => {
    console.log('Received reload_userList', { users });
    io.emit('users', { users });
  });

  socket.on('log_out', () => {
    const loggedOutUser = users.find((user) => user.id === socket.id);
    io.emit('alert_message', {
      alertMessage: loggedOutUser?.userName + ' left the chat, connection lost',
    });
    socket.disconnect();
    io.emit('users', { users });
  });

  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
    removeUser(socket.id);
    io.emit('users', { users });
    console.log('users: ', users);
  });
});

const handleSIG = () => {
  console.log('SIGINT/SIGTERM signal received. Terminating...');
  // io.socket.server.close();
  io.emit('disconnect');
};

server.listen(3001, () => console.log('SERVER RUNNING AT PORT 3000'));

process.on('SIGINT', handleSIG);
process.on('SIGTERM', handleSIG);
