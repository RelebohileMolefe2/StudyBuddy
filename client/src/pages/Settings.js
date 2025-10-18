import React, { useEffect, useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    email_alerts: false,
    dark_mode: false,
    push_notifications: false
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Simulate fetching settings on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Fake fetched settings
      const mockSettings = {
        email_alerts: true,
        dark_mode: false,
        push_notifications: true
      };

      setSettings(mockSettings);
      setLoading(false);
    }, 1000); // Simulate 1s load time

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    // Simulate saving with a delay
    setStatus('Saving...');
    setTimeout(() => {
      setStatus('Settings updated successfully.');
    }, 1000);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">User Settings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="settings-options">
            <label className="setting-toggle">
              <input
                type="checkbox"
                name="email_alerts"
                checked={settings.email_alerts}
                onChange={handleChange}
              />
              Email Alerts
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                name="dark_mode"
                checked={settings.dark_mode}
                onChange={handleChange}
              />
              Dark Mode
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                name="push_notifications"
                checked={settings.push_notifications}
                onChange={handleChange}
              />
              Push Notifications
            </label>
          </div>

          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>

          {status && <p className="status-message">{status}</p>}
        </>
      )}
    </div>
  );
}

export default Settings;
