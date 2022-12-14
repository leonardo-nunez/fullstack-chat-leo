const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const { createServer } = require('http');

const { Server } = require('socket.io');

const server = createServer(app);

app.use(express.static(path.join(__dirname, './client/build')));
app.get('/', (req, res) => res.sendFile(__dirname + './index.html'));
app.get('/*', (req, res) => res.redirect('/'));

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

  socket.on('login', async (newUser) => {
    const userDetails = addUser(socket.id, newUser);
    socket.emit('logged_in', userDetails);
    io.emit('users', { users });
  });

  socket.on(
    'send_message',
    (obj) => (
      console.log(`Sent message: ${obj.message}`),
      clearTimeout(inactivityTimer),
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
    const loggedOutUser = users.find((user) => user.socketUid === socket.id);
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
  });
});

const handleSIG = () => {
  console.log('SIGINT/SIGTERM signal received. Terminating...');
  io.socket.close();
  // io.emit('disconnect');
};

server.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));

process.on('SIGINT', handleSIG);
process.on('SIGTERM', handleSIG);
