import React from 'react';
import { useState, useEffect } from 'react';

const Settings = ({ socket }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inactiveTime, setInactiveTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    socket.on('starting_settings', (recievedTime) => {
      setInactiveTime(recievedTime);
    });
    socket.on('update_settings', (recievedTime) => {
      setInactiveTime(recievedTime);
    });
    return () => {
      socket.off('starting_settings');
      socket.on('update_settings');
    };
  }, [socket]);

  const updateTimer = () => {
    socket.emit('send_updated_settings', inactiveTime);
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
