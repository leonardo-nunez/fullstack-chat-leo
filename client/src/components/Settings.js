import { useState, useEffect } from 'react';

const Settings = ({ socket }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inactiveTime, setInactiveTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    socket.on('starting_settings', (recievedTime) => {
      setInactiveTime(recievedTime);
    });
    return () => {
      socket.off('starting_settings');
    };
  }, []);

  // useEffect(() => {
  //   socket.emit('update_settings', inactiveTime);

  //   return () => {
  //     socket.off('update_settings');
  //   };
  // }, [inactiveTime]);

  const validateSettings = () => {};

  const updateTimer = () => {
    socket.emit('update_settings', inactiveTime);
    setSettingsOpen(false);
  };

  return (
    <div className="settings">
      {settingsOpen && (
        <div className="settings__window">
          <p>
            Log out if inactive for{' '}
            <input
              className="settings__number-input"
              type="number"
              min="0"
              max="60"
              value={inactiveTime.minutes}
              onChange={(e) =>
                setInactiveTime({
                  ...inactiveTime,
                  minutes: Number(e.target.value),
                })
              }
            />{' '}
            min and{' '}
            <input
              className="settings__number-input"
              type="number"
              min="0"
              max="60"
              value={inactiveTime.seconds}
              onChange={(e) =>
                setInactiveTime({
                  ...inactiveTime,
                  seconds: Number(e.target.value),
                })
              }
            />{' '}
            seconds
          </p>
          <button className="settings__update-btn" onClick={updateTimer}>
            Update
          </button>
        </div>
      )}
      <div className="settings__btn-wrapper">
        <button
          className="settings__btn"
          onClick={() =>
            setSettingsOpen((prevsettingsOpen) => !prevsettingsOpen)
          }
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default Settings;
