import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import InfoModal from '../components/InfoModal';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);

  // State for school details
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('schoolName') || 'My School');
  const [affiliationNo, setAffiliationNo] = useState(() => localStorage.getItem('affiliationNo') || 'AB-12345');
  const [schoolLogo, setSchoolLogo] = useState(() => localStorage.getItem('schoolLogo') || '');
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('timeFormat') || '12h');
  const [showNotifications, setShowNotifications] = useState(() => {
    const saved = localStorage.getItem('showNotifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  
  const handleSave = () => {
    localStorage.setItem('schoolName', schoolName);
    localStorage.setItem('affiliationNo', affiliationNo);
    localStorage.setItem('schoolLogo', schoolLogo);
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('showNotifications', JSON.stringify(showNotifications));
    setInfoModalOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearData = () => {
    setConfirmModalOpen(true);
  };

  const confirmClearData = () => {
    // Logic to clear data
    localStorage.clear();
    // Maybe force a reload to reflect changes, e.g. logging out
    window.location.reload();
  };

  return (
    <div className="settings-container">
       <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Settings Saved"
        message="Your new settings have been saved successfully."
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmClearData}
        title="Clear All Data"
        message="Are you sure you want to clear all data? This action is irreversible and will log you out."
        confirmText="Clear Data"
      />
      <h1>Settings</h1>

      <div className="settings-card">
        <h2>Branding Settings</h2>
        <p>These details will appear on student report cards.</p>
        <div className="form-group">
          <label htmlFor="schoolName">School Name</label>
          <input type="text" id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="affiliationNo">Affiliation No.</label>
          <input type="text" id="affiliationNo" value={affiliationNo} onChange={(e) => setAffiliationNo(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="schoolLogo">School Logo</label>
          <input type="file" id="schoolLogo" accept="image/*" onChange={handleLogoChange} />
          {schoolLogo && <img src={schoolLogo} alt="Logo Preview" className="logo-preview"/>}
        </div>
      </div>

      <div className="settings-card">
        <h2>Appearance Settings</h2>
        <div className="form-group">
          <label htmlFor="timeFormat">Time Format</label>
          <select id="timeFormat" value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
            <option value="12h">12-Hour</option>
            <option value="24h">24-Hour</option>
          </select>
        </div>
        <div className="form-group setting-toggle">
          <label htmlFor="showNotifications">Show Event Notifications</label>
          <label className="switch">
            <input type="checkbox" id="showNotifications" checked={showNotifications} onChange={(e) => setShowNotifications(e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={handleSave} className="save-settings-btn">Save All Settings</button>
      </div>

      <div className="settings-card danger-zone">
        <h2>Danger Zone</h2>
        <p>These actions are irreversible. Please proceed with caution.</p>
        <button onClick={handleClearData} className="clear-data-btn">Clear All Local Data</button>
      </div>
    </div>
  );
};

export default SettingsPage; 