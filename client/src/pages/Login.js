import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';

const Login = ({
  inactive,
  setInactive,
  isLoggedIn,
  setIsLoggedIn,
  userName,
  setUserName,
  socket,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    !socket.connected && socket.connect();
    setTimeout(() => {
      socket.emit('login_page_load');
    }, 200);

    return () => {
      socket.off('login_page_load');
    };
  }, [socket]);

  useEffect(() => {
    isLoggedIn && navigate('/chat');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    inactive &&
      setErrorMessage('Disconnected by the server due to inactivity.');
    setInactive(false);
  }, [inactive, setInactive]);

  const displayErrorMessage = (err) => {
    setErrorMessage(err);
    return setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const logIn = (e) => {
    e.preventDefault();
    if (!userName) return displayErrorMessage('Choose a username...');
    socket.emit('login', userName);
    socket.on('logged_in', (message) => {
      if (!message.userName) return displayErrorMessage(message.error);
      setIsLoggedIn(true);
      setErrorMessage('');
      navigate('/chat');
    });
    // Solve in better way?
    // socket.on('connect_error', () => {
    //   displayErrorMessage('Server unavailable');
    //   socket.off('connect_error');
    // });
    !socket.connected &&
      setTimeout(() => {
        displayErrorMessage('Server unavailable');
      }, 100);
  };

  return (
    <>
      <div className="login">
        <div className="login__logo">
          <h6>💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬</h6>
          <h5>💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬</h5>
          <h4>💬💬💬💬💬💬💬💬💬💬💬</h4>
          <h3>💬💬💬💬💬💬💬</h3>
          <h2>💬💬💬💬</h2>
          <h1>💬</h1>
        </div>
        <form className="login__form" action="submit">
          <input
            autoFocus
            className="login__input"
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username..."
          />
          <button type="submit" className="login__button" onClick={logIn}>
            ▶
          </button>
        </form>
        <h5 className="login__error-message">{errorMessage}</h5>
      </div>
      <Settings socket={socket} />
    </>
  );
};

export default Login;
