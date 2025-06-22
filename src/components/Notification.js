import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    info: 'bx bxs-info-circle',
    success: 'bx bxs-check-circle',
    error: 'bx bxs-x-circle',
    warning: 'bx bxs-error-circle',
  };

  return (
    <div className={`notification ${type} ${exiting ? 'exit' : ''}`}>
      <div className="notification-icon">
        <i className={icons[type] || icons.info}></i>
      </div>
      <div className="notification-message">{message}</div>
      <button onClick={handleClose} className="notification-close-btn">&times;</button>
    </div>
  );
};

export default Notification; 