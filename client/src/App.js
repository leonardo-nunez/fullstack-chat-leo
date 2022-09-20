import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Chat from './pages/Chat';

export const socket = io.connect('http://localhost:3001');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              userName={userName}
              setUserName={setUserName}
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
              userName={userName}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
