import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import Settings from '../components/Settings';

import GoogleButton from 'react-google-button';

const Login = ({
  inactive,
  setInactive,
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  socket,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      !socket.connected && socket.connect();
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

  const logIn = async (e) => {
    e.preventDefault();
    const googleUser = await signInWithPopup(auth, provider);
    const newUser = {
      googleUid: googleUser.user.uid,
      userName: googleUser.user.displayName,
      email: googleUser.user.email,
      photo: googleUser.user.photoURL,
    };
    setUser(newUser);
    socket.emit('login', newUser);
    socket.on('logged_in', (message) => {
      if (!message.userName) return displayErrorMessage(message.error);
      setIsLoggedIn(true);
      setErrorMessage('');
      sendJoinMessage(message.userName);
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

  const sendJoinMessage = (userName) => {
    const joinMessage = {
      id: Date.now(),
      userName: userName,
      message: 'Login message',
      alertMessage: userName + ' joined the chat',
    };
    socket.emit('send_message', joinMessage);
  };

  return (
    <>
      <div className="login">
        <h3 className="login__heading">Welcome to</h3>
        <h1 className="login__heading login__name">ChatUpNow</h1>
        <div className="login__logo">
          <h6>💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬</h6>
          <h5>💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬</h5>
          <h4>💬💬💬💬💬💬💬💬💬💬💬</h4>
          <h3>💬💬💬💬💬💬💬</h3>
          <h2>💬💬💬💬</h2>
          <h1>💬</h1>
        </div>
        <GoogleButton className="login__button" onClick={logIn} type="light" />
        <h5 className="login__error-message">{errorMessage}</h5>
      </div>
      <Settings socket={socket} />
    </>
  );
};

export default Login;
