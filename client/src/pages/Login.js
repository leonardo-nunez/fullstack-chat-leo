import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ isLoggedIn, setIsLoggedIn, userName, setUserName }) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   isLoggedIn && navigate('/chat');
  // }, []);

  const logIn = () => {
    if (userName) {
      setIsLoggedIn(true);
      navigate('/chat');
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
    </div>
  );
};

export default Login;
