import { useState, useEffect } from 'react';

const Settings = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inactiveTimer, setInactiveTimer] = useState({
    minutes: 10,
    seconds: 0,
  });

  useEffect(() => {
    return () => {
      second;
    };
  }, []);

  return (
    <div className="settings">
      {settingsOpen && (
        <div className="settings__window">
          <p>
            Log out if inactive for <input /> min and <input /> seconds
          </p>
        </div>
      )}
      <button
        onClick={() => setSettingsOpen((prevsettingsOpen) => !prevsettingsOpen)}
      >
        ⚙️
      </button>
    </div>
  );
};

export default Settings;
