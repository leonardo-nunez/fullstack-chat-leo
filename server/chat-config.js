const inactivityTimerMinutes = 0;
const inactivityTimerSeconds = 10;

const chatConfig = {
  inactivityTimer:
    inactivityTimerMinutes * 60000 + inactivityTimerSeconds * 1000,
};

module.exports = chatConfig;
