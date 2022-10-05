const inactivityTime = { minutes: 5, seconds: 11 };

const inactivityMS = () => {
  return inactivityTime.minutes * 60000 + inactivityTime.seconds * 1000;
};

module.exports = {
  inactivityTime,
  inactivityMS,
};
