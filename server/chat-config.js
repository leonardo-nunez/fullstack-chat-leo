const inactivityTimerMinutes = 10;
const inactivityTimerSeconds = 0;

const chatConfig = {
  inactivityTimer:
    inactivityTimerMinutes * 60000 + inactivityTimerSeconds * 1000,
};

module.exports = chatConfig;
