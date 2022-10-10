const users = [];

const addUser = (socketUid, userObj) => {
  // const multipleUser = users.find((user) => user.userName === userObj.userName);
  // if (multipleUser) {
  //   return { error: 'Username is taken. Choose a new one' };
  // }

  const newUserObj = { ...userObj, socketUid };
  users.push(newUserObj);
  return newUserObj;
};

const removeUser = (socketUid) => {
  const removedUser = users.find((user) => user.socketUid === socketUid);
  users.splice(users.indexOf(removedUser), 1);
};

module.exports = {
  users,
  addUser,
  removeUser,
};
