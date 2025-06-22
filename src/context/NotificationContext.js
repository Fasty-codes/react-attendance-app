import React, { createContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

export const NotificationContext = createContext(null);

let id = 1;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    const newNotification = {
      id: id++,
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);

    if (duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, duration);
    }
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.map(n => n.id === id ? { ...n, exiting: true } : n)
    );
    
    setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300); // Corresponds to animation time
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
