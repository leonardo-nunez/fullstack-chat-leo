import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({
  isLoggedIn,
  setIsLoggedIn,
  userName,
  setUserName,
  socket,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate('/chat');
  }, [isLoggedIn, navigate]);

  const displayErrorMessage = (err) => {
    setErrorMessage(err);
    return setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const logIn = () => {
    !socket.connected && socket.connect();
    if (!userName) {
      return displayErrorMessage('Choose a username...');
    }
    socket.emit('login', userName);
    socket.on('logged_in', (message) => {
      if (!message.userName) {
        return displayErrorMessage(message.error);
      }
      setIsLoggedIn(true);
      navigate('/chat');
    });
  };

  return (
    <div>
      <input
        onChange={(e) => setUserName(e.target.value)}
        type="text"
        placeholder="Username..."
      />
      <button onClick={logIn}>Log in</button>
      <h5>{errorMessage}</h5>
    </div>
  );
};

export default Login;
