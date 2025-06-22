import React from 'react';
import Modal from './Modal';
import './InfoModal.css';

const InfoModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="info-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onClose} className="ok-btn">OK</button>
      </div>
    </Modal>
  );
};

export default InfoModal; 