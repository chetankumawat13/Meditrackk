import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ title = 'Notification', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="toast">
      <div className="toast-content">
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
