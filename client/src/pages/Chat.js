import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ isLoggedIn, setIsLoggedIn, userName, socket }) => {
  const [messageToSend, setMessageToSend] = useState('');
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    !isLoggedIn && navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessageList((list) => [...list, message]);
      console.log('messageList set');
    });
  }, [socket]);

  const sendMessage = () => {
    const objToSend = {
      userName,
      message: messageToSend,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        new Date(Date.now()).getMinutes(),
    };
    socket.emit('send_message', objToSend);
  };

  const logOut = () => {
    socket.disconnect();
    setIsLoggedIn(false);
  };

  return (
    <div>
      <input
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
        type="text"
        placeholder="Message..."
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={logOut}>Log Out</button>
      {messageList.map((message, i) => (
        <div key={i}>
          <h3>{message.message}</h3>
          <p>{message.userName}</p>
          <p>{message.time}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
