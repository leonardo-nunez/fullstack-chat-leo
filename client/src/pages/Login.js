import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import Settings from '../components/Settings';

const Login = ({
  inactive,
  setInactive,
  setIsAuth,
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
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

  const logIn = async (e) => {
    e.preventDefault();
    if (!user) return displayErrorMessage('Choose a username...');

    const googleUser = await signInWithPopup(auth, provider);
    const newUser = {
      googleUid: googleUser.user.uid,
      userName: googleUser.user.displayName,
      email: googleUser.user.email,
      photo: googleUser.user.photoURL,
    };
    setUser(newUser);
    socket.emit('login', newUser);
    localStorage.setItem('isAuth', true);
    setIsAuth(true);
    socket.on('logged_in', (message) => {
      if (!message.userName) return displayErrorMessage(message.error);
      setIsLoggedIn(true);
      setErrorMessage('');
    });
    navigate('/chat');

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
        <h1>💬</h1>
        <form className="login__form" action="submit">
          {/* <input
            autoFocus
            className="login__input"
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username..."
          /> */}
          <button type="submit" className="login__button" onClick={logIn}>
            Sign in with Google
          </button>
        </form>
        <h5 className="login__error-message">{errorMessage}</h5>
      </div>
      <Settings socket={socket} />
    </>
  );
};

export default Login;
