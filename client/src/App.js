import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Chat from './pages/Chat';
import UserDisplay from './components/UserDisplay';

const production = 'https://chatupnow.onrender.com/';
const development = 'http://localhost:3001';

export const socket = io.connect(
  process.env.NODE_ENV === production ? production : development,
  { secure: true }
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [inactive, setInactive] = useState(false);

  return (
    <div className='App'>
      <UserDisplay socket={socket} />
      <Routes>
        <Route
          path='/'
          element={
            <Login
              inactive={inactive}
              setInactive={setInactive}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={user}
              setUser={setUser}
              socket={socket}
            />
          }
        />
        <Route
          path='/chat'
          element={
            <Chat
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              socket={socket}
              user={user}
              setUser={setUser}
              setInactive={setInactive}
            />
          }
        />
      </Routes>
      <div className='mobile-height'></div>
    </div>
  );
}

export default App;
