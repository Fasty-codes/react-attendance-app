import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [name, setName] = useState(user.name || 'Teacher Name');

  // Initialize state from localStorage or user context
  const [email, setEmail] = useState(user.email || '');
  const [address, setAddress] = useState(() => localStorage.getItem(`profile_address_${user.id}`) || '123 Main St, Anytown, USA');
  const [phone, setPhone] = useState(() => localStorage.getItem(`profile_phone_${user.id}`) || '+1 (555) 123-4567');
  const [isEditing, setIsEditing] = useState(false);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUserData = {
      name: name,
    };
    if (newProfilePic) {
      updatedUserData.profilePicture = newProfilePic;
    }
    updateUser(updatedUserData);
    localStorage.setItem(`profile_address_${user.id}`, address);
    localStorage.setItem(`profile_phone_${user.id}`, phone);
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <h1>Your Profile</h1>
      <div className="profile-card">
        <div className="profile-picture-section">
          <img 
            src={newProfilePic || user.profilePicture || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="profile-picture"
          />
          <input type="file" id="profilePicUpload" accept="image/*" onChange={handlePictureChange} style={{display: 'none'}} />
          <label htmlFor="profilePicUpload" className="upload-btn">
            <i className='bx bx-camera'></i>
          </label>
        </div>
        <div className="profile-details-section">
          <div className="profile-section-header">Profile Details</div>
          <div className="profile-field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
          </div>
          <div className="profile-field">
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditing}></textarea>
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                <i className='bx bx-pencil'></i> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="save-profile-btn">
                  <i className='bx bx-save'></i> Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="cancel-profile-btn">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 