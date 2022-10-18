import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Chat from './pages/Chat';
import UserDisplay from './components/UserDisplay';

// export const socket = io.connect('https://fullstack-chat-leo.herokuapp.com/', {
//   secure: true,
// });

const url = window.location.href;

const isLocalhost = () => {
  return url.includes('localhost') || url.includes('127.0.0.1');
};

export const socket = io.connect(
  isLocalhost()
    ? 'http://localhost:3001'
    : 'https://fullstack-chat-leo.herokuapp.com/',
  {
    secure: true,
  }
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [inactive, setInactive] = useState(false);

  return (
    <div className="App">
      <UserDisplay socket={socket} />
      <Routes>
        <Route
          path="/"
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
          path="/chat"
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
      <div className="mobile-height"></div>
      {/* <button onClick={() => console.log(window.location.href)}>local?</button> */}
    </div>
  );
}

export default App;
