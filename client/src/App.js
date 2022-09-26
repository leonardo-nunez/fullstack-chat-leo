import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Chat from './pages/Chat';
import UserDisplay from './components/UserDisplay';

export const socket = io.connect('http://localhost:3001');

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
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
              userName={userName}
              setUserName={setUserName}
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
              userName={userName}
              setUserName={setUserName}
              setInactive={setInactive}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
