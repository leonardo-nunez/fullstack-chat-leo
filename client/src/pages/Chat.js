import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({
  isLoggedIn,
  setIsLoggedIn,
  userName,
  setUserName,
  socket,
  setInactive,
}) => {
  const [messageToSend, setMessageToSend] = useState('');
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();

  const bottomRef = useRef(null);

  useEffect(() => {
    !isLoggedIn && navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const joinMessage = {
      id: Date.now(),
      userName,
      message: 'Login message',
      alertMessage: userName + ' joined the chat',
    };
    socket.emit('send_message', joinMessage);
    setMessageList([{ alertMessage: `Welcome to the chat ${userName}!` }]);

    return () => {
      socket.off('send_message');
    };
  }, [socket, userName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessageList((list) => [...list, message]);
      console.log('messageList set');
    });

    socket.on('alert_message', (message) => {
      setMessageList((list) => [...list, message]);
    });

    socket.on('inactive', () => {
      setInactive(true);
      setIsLoggedIn(false);
    });

    socket.on('connect_error', () => {
      setIsLoggedIn(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('alert_message');
      socket.off('disconnected');
      socket.off('connect_error');
    };
  }, [socket, setInactive, setIsLoggedIn]);

  const sendMessage = (e) => {
    e.preventDefault();
    const objToSend = {
      id: Date.now(),
      userName,
      message: messageToSend,
      time:
        String(new Date(Date.now()).getHours()).padStart(2, '0') +
        ':' +
        String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
    };
    if (messageToSend) {
      setMessageList((list) => [...list, objToSend]);
      socket.emit('send_message', objToSend);
      setMessageToSend('');
    }
  };

  const logOut = async () => {
    setUserName('');
    setIsLoggedIn(false);
    socket.emit('log_out');
    // socket.emit('reload_userList');
  };

  return (
    <div className="chat">
      <div className="chat__window">
        {messageList.map((message, i) => (
          <div
            key={i}
            className={
              message.userName === userName
                ? 'my-message-box'
                : 'others-message-box'
            }
          >
            {message.alertMessage ? (
              <div className="chat__message chat__alert-message">
                <p>{message?.alertMessage}</p>
              </div>
            ) : (
              <div className="message__wrapper">
                <h4
                  className={
                    message.userName === userName
                      ? 'chat__message my-message'
                      : 'chat__message others-message'
                  }
                >
                  {message?.message}
                </h4>
                <div
                  className={
                    message.userName === userName
                      ? 'message__footer my-footer'
                      : 'message__footer others-footer'
                  }
                >
                  <p
                    className="message__username"
                    style={
                      message.userName === userName
                        ? { display: 'none' }
                        : { display: 'inline' }
                    }
                  >
                    {message?.userName} -&nbsp;
                  </p>
                  <p className="message__time">{message?.time}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat__controlls">
        <form className="chat__form" action="submit">
          <input
            autoFocus
            className="chat__input"
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            type="text"
            placeholder="Message..."
          />
          <button
            type="submit"
            className="chat__button chat__button--send"
            onClick={sendMessage}
          >
            ▶
          </button>
        </form>
        <button className="chat__button chat__button--log-out" onClick={logOut}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default Chat;
