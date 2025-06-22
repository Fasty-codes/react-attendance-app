import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Modal from './Modal';
import './StudentEditModal.css';

const StudentEditModal = ({ isOpen, onClose, onSave, student }) => {
  const isEditMode = student !== null;
  const [formData, setFormData] = useState({});
  const [isCameraOpen, setCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setFormData(student);
    } else {
      // Reset form for new student
      setFormData({ name: '', regNo: '', address: '', contact: '', photo: null });
    }
  }, [student, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, photo: imageSrc });
    setCameraOpen(false);
  }, [webcamRef, setFormData, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.regNo || !formData.contact) {
      alert('Register Number and Contact Number are required.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="student-edit-modal">
        <h2>{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="full-width photo-section">
              <div className="photo-preview" style={{ backgroundImage: `url(${formData.photo})` }}>
                {!formData.photo && <i className='bx bxs-user'></i>}
              </div>
              <div className="photo-actions">
                <input type="file" accept="image/*" onChange={handleFileChange} id="upload-photo" style={{display: 'none'}}/>
                <label htmlFor="upload-photo" className="button-like">Upload</label>
                <button type="button" onClick={() => setCameraOpen(!isCameraOpen)}>
                  {isCameraOpen ? 'Close Camera' : 'Open Camera'}
                </button>
              </div>
              {isCameraOpen && (
                <div className="camera-view">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                  />
                  <button type="button" onClick={capturePhoto}>Capture photo</button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Register No. (Required)</label>
              <input type="text" name="regNo" value={formData.regNo || ''} onChange={handleChange} required />
            </div>
            <div className="full-width form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact No. (Required)</label>
              <input type="tel" name="contact" value={formData.contact || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StudentEditModal; 