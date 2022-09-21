import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ isLoggedIn, setIsLoggedIn, userName, setUserName, socket }) => {
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
      // console.log('recieved message: ', message);
    });

    socket.on('alert_message', (message) => {
      setMessageList((list) => [...list, message]);
    });

    socket.on('disconnected', () => {
      setIsLoggedIn(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('alert_message');
      socket.off('disconnected');
    };
  }, [socket]);

  const sendMessage = () => {
    const objToSend = {
      id: Date.now(),
      userName,
      message: messageToSend,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        new Date(Date.now()).getMinutes(),
    };
    setMessageList((list) => [...list, objToSend]);
    socket.emit('send_message', objToSend);
    // console.log('objToSend: ', objToSend);
  };

  const logOut = () => {
    socket.emit('log_out');
    setUserName('');
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
          <h3>{message?.message}</h3>
          <p>{message?.userName}</p>
          <p>{message?.time}</p>
          <p>{message?.alertMessage}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
