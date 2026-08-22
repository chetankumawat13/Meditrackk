import React from 'react';
import './Modal.css';

const Modal = ({ open, onClose, children, contentClassName = '' }) => {
  if (!open) return null;

  return (
    <div
      className="modal show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`modal-content ${contentClassName}`}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
