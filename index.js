const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const { createServer } = require('http');

const { Server } = require('socket.io');
// const cors = require('cors');
// app.use(cors);

const server = createServer(app);

app.use(express.static(path.join(__dirname, './client/build')));
app.get('/', (req, res, next) => res.sendFile(__dirname + './index.html'));

const { inactivityTime, inactivityMS } = require('./chat-config');
const { users, addUser, removeUser } = require('./users');

const io = new Server(server, {
  cors: {
    origin: server,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  let inactivityTimer;

  socket.on('login_page_load', () => {
    io.emit('users', { users });
    io.emit('starting_settings', inactivityTime);
  });

  socket.on('send_updated_settings', (inactiveTime) => {
    inactivityTime.minutes = inactiveTime.minutes;
    inactivityTime.seconds = inactiveTime.seconds;
    io.emit('update_settings', inactiveTime);
  });

  socket.on('login', (userName) => {
    // try {
    const userDetails = addUser(socket.id, userName);
    socket.emit('logged_in', userDetails);
    io.emit('users', { users });
    // console.log('users: ', users);
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
      }, inactivityMS())),
      socket.broadcast.emit('receive_message', obj)
    )
  );

  socket.on('log_out', () => {
    const loggedOutUser = users.find((user) => user.id === socket.id);
    io.emit('alert_message', {
      alertMessage: loggedOutUser?.userName + ' left the chat',
    });
    socket.disconnect();
    io.emit('users', { users });
  });

  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
    removeUser(socket.id);
    io.emit('users', { users });
    // console.log('users: ', users);
  });
});

const handleSIG = () => {
  console.log('SIGINT/SIGTERM signal received. Terminating...');
  // io.emit('server_disconnected', {
  //   errorMessage: 'Server disconnected',
  // });
  // io.socket.server.close();
  io.emit('disconnect');
};

// app.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));
server.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));

process.on('SIGINT', handleSIG);
process.on('SIGTERM', handleSIG);
