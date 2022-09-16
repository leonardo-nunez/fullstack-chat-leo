import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function App() {
  const [messageToSend, setMessageToSend] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessageList((list) => [...list, message]);
      console.log();
    });
  }, [socket]);

  const sendMessage = () => {
    const objToSend = {
      message: messageToSend,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        new Date(Date.now()).getMinutes(),
    };
    socket.emit('send_message', objToSend);
  };
  return (
    <div className="App">
      <input
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
        type="text"
        placeholder="Message..."
      />
      <button onClick={sendMessage}>Send</button>
      {messageList.map((message) => (
        <div>
          <h3>{message.message}</h3>
          <p>{message.time}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
