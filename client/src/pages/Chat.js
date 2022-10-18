import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  socket,
  setInactive,
}) => {
  const [messageToSend, setMessageToSend] = useState('');
  const [messageList, setMessageList] = useState([
    { alertMessage: `Welcome to the chat ${user.userName}!` },
  ]);
  const navigate = useNavigate();

  const bottomRef = useRef(null);

  useEffect(() => {
    !isLoggedIn && navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessageList((list) => [...list, message]);
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
      socket.off('connect_error');
      socket.off('inactive');
    };
  }, [socket, setInactive, setIsLoggedIn]);

  const sendMessage = (e) => {
    e.preventDefault();
    const objToSend = {
      id: Date.now(),
      googleUid: user.googleUid,
      userName: user.userName,
      photo: user.photo,
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

  const logOut = () => {
    setUser({});
    setMessageList([]);
    setIsLoggedIn(false);
    socket.emit('log_out');
  };

  return (
    <div className="chat">
      <div className="chat__window">
        {messageList.map((message, i) => (
          <div
            key={i}
            className={
              message.googleUid === user.googleUid
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
                <div className="message__photo-wrapper">
                  <img
                    className="message__photo"
                    src={message.photo}
                    alt="profile_photo"
                    style={{ marginRight: '0.5rem' }}
                  />
                  <h4
                    className={
                      message.googleUid === user.googleUid
                        ? 'chat__message my-message'
                        : 'chat__message others-message'
                    }
                  >
                    {message?.message}
                  </h4>
                </div>
                <div
                  className={
                    message.googleUid === user.googleUid
                      ? 'message__footer my-footer'
                      : 'message__footer others-footer'
                  }
                >
                  <p
                    className="message__username"
                    style={
                      message.googleUid === user.googleUid
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
        <button
          title="Log out"
          className="chat__button chat__button--log-out"
          onClick={logOut}
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
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
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
