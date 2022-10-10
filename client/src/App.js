import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Chat from './pages/Chat';
import UserDisplay from './components/UserDisplay';

export const socket = io.connect('http://localhost:3001');
// export const socket = io.connect('https://fullstack-chat-leo.herokuapp.com/', {
//   secure: true,
// });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [inactive, setInactive] = useState(false);
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  return (
    <div className="App">
      <UserDisplay socket={socket} />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              isAuth={isAuth}
              setIsAuth={setIsAuth}
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
              setIsAuth={setIsAuth}
              socket={socket}
              user={user}
              setUser={setUser}
              setInactive={setInactive}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
