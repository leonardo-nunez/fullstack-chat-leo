import { useState, useEffect } from 'react';

const UserDisplay = ({ socket }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.on('users', (userList) => {
      setUserList(userList.users);
      console.log('userList set...');
    });

    return () => {
      socket.off('users');
    };
  }, [socket]);

  return (
    <div className="userList">
      <h5>Userlist:</h5>
      {userList.map((user, i) => (
        <p key={i}>{user.userName}</p>
      ))}
    </div>
  );
};

export default UserDisplay;
