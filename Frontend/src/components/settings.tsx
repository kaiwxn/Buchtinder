import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function Settings() {

  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("de");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const storedNotifications = localStorage.getItem("settings_notifications");
    const storedDarkMode = localStorage.getItem("settings_darkMode");
    const storedLanguage = localStorage.getItem("settings_language");

    if (storedNotifications !== null) {
      setNotifications(storedNotifications === "true");
    }
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
    }
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("settings_notifications", notifications.toString());
    localStorage.setItem("settings_darkMode", darkMode.toString());
    localStorage.setItem("settings_language", language);
    setConfirmationMessage("Einstellungen wurden gespeichert!");
    setTimeout(() => setConfirmationMessage(""), 5000);
  };

 
  const confirmationOverlay = confirmationMessage && ReactDOM.createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-4 py-2 rounded shadow">
      {confirmationMessage}
    </div>,
    document.body
  );

  return (
    <>
      {confirmationOverlay}
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Einstellungen</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Allgemein</h2>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Benachrichtigungen aktivieren
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="darkMode" className="text-sm text-gray-700">
              Dark Mode aktivieren
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Sprache
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="de">Deutsch</option>
              <option value="en">Englisch</option>
              <option value="fr">FranzÃ¶sisch</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-md transition-colors text-base bg-blue-600 text-white hover:bg-blue-700"
        >
          Einstellungen speichern
        </button>
      </div>
    </>
  );
}

export default Settings;