const users = [];

const addUser = (id, userName) => {
  const multipleUser = users.find((user) => user.userName === userName);
  if (multipleUser) {
    return { error: 'Username is taken. Choose a new one' };
  }
  const user = { id, userName };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const removedUser = users.find((user) => user.id === id);
  users.splice(users.indexOf(removedUser), 1);
};

module.exports = {
  users,
  addUser,
  removeUser,
};
