import React from 'react';
import Modal from './Modal';
import './InfoModal.css';

const InfoModal = ({ isOpen, onClose, title, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div style={{ padding: '1.5rem', minWidth: 280 }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{title}</h2>
      <div>{children}</div>
    </div>
  </Modal>
);

export default InfoModal; 