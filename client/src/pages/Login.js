import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({
  isLoggedIn,
  setIsLoggedIn,
  userName,
  setUserName,
  socket,
}) => {
  const [errorMessage, seterrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate('/chat');
  }, [isLoggedIn, navigate]);

  const logIn = () => {
    !socket.connected && socket.connect();
    if (userName) {
      socket.emit('login', userName);
      socket.on('logged_in', (message) => {
        if (!message.userName) {
          seterrorMessage(message.error);
          return setTimeout(() => {
            seterrorMessage('');
          }, 3000);
        }
        setIsLoggedIn(true);
        navigate('/chat');
      });
    }
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
