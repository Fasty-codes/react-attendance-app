import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <i className='bx bxs-school logo-icon'></i>
        <span className="logo-text">AttendWise</span>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard">
            <i className='bx bxs-dashboard'></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/timetable">
            <i className='bx bx-calendar'></i>
            <span>My Timetable</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports">
            <i className='bx bxs-report'></i>
            <span>Reports</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings">
            <i className='bx bxs-cog'></i>
            <span>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <i className='bx bxs-user-circle'></i>
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <div className="user-profile-box">
          <img 
            src={user.profilePicture || 'https://via.placeholder.com/40'} 
            alt="User" 
            className="sidebar-profile-pic"
          />
          {!isCollapsed && (
            <div className="user-details">
              <span className="user-name">{user.name || 'Teacher'}</span>
              <span className="user-email">{user.email}</span>
            </div>
          )}
        </div>
        <button onClick={logout} className="logout-btn">
          <i className='bx bx-log-out'></i>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 