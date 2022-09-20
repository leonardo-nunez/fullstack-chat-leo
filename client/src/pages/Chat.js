import { useState, useEffect } from 'react';

const Chat = ({ isLoggedIn, setIsLoggedIn, userName, socket }) => {
  const [messageToSend, setMessageToSend] = useState('');
  const [messageList, setMessageList] = useState([]);

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
  return (
    <div>
      <input
        value={messageToSend}
        onChange={(e) => setMessageToSend(e.target.value)}
        type="text"
        placeholder="Message..."
      />
      <button onClick={sendMessage}>Send</button>
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
