import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className='bx bx-menu'></i>
        </button>
        <div className="header-title">
          <h1>Attendance App</h1>
        </div>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <i className='bx bxs-moon'></i> : <i className='bx bxs-sun'></i>}
        </button>
        <Link to="/profile" className="user-profile-link">
          <div className="user-profile">
            <i className='bx bxs-user-circle'></i>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header; 