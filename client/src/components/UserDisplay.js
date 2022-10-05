import { useState, useEffect } from 'react';

const UserDisplay = ({ socket }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.on('users', (userList) => {
      setUserList(userList.users);
    });

    return () => {
      socket.off('users');
    };
  }, [socket]);

  return (
    <div
      className="user-list"
      style={
        !userList.length ? { visibility: 'hidden' } : { visibility: 'visible' }
      }
    >
      <h5 className="user-list__heading">Userlist:</h5>
      <div className="user-list__list">
        {userList.map((user, i) => (
          <p className="user-list__name" key={i}>
            {i !== 0 && ', '}
            {user.userName}
          </p>
        ))}
      </div>
    </div>
  );
};

export default UserDisplay;
