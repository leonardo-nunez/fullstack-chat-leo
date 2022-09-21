const express = require('express');
const app = express();
const { createServer } = require('http');

const { Server } = require('socket.io');
const cors = require('cors');
app.use(cors);

const server = createServer(app);

const users = [];

// const timeoutTime = 300000;

const addUser = (id, userName) => {
  const multipleUser = users.find((user) => user.userName === userName);
  if (multipleUser) {
    return { error: 'Username is taken. Choose a new one' };
  }
  const user = { id, userName };
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

  let inactivityTimer;

  socket.on('login', (userName) => {
    try {
      const userDetails = addUser(socket.id, userName);
      socket.emit('logged_in', userDetails);
      if (userDetails.userName) {
        socket.broadcast.emit('receive_message', {
          alertMessage: userDetails.userName + ' joined the chat',
        });
        io.emit('users', { users });
      }
      console.log('users: ', users);
    } catch (error) {}
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
        socket.emit('disconnected');
        socket.disconnect();
      }, 6000)),
      socket.broadcast.emit('receive_message', obj)
    )
  );

  socket.on('log_out', () => {
    const loggedOutUser = users.find((user) => user.id === socket.id);
    io.emit('alert_message', {
      alertMessage: loggedOutUser.userName + ' left the chat',
    });
    socket.disconnect();
  });

  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

    removeUser(socket.id);
    io.emit('users', { users });
    console.log('users: ', users);
  });
});

server.listen(3001, () => console.log('SERVER RUNNING AT PORT 3000'));
