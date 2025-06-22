import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [time, setTime] = useState(new Date());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('timeFormat') || '12h');

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
      const newTimeFormat = localStorage.getItem('timeFormat') || '12h';
      if (newTimeFormat !== timeFormat) {
        setTimeFormat(newTimeFormat);
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeFormat]);

  // Load classes from localStorage when component mounts
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    setClasses(storedClasses);
  }, [user.id]);

  // Save classes to localStorage
  const saveClasses = (updatedClasses) => {
    setClasses(updatedClasses);
    localStorage.setItem(`classes_${user.id}`, JSON.stringify(updatedClasses));
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass = {
      id: Date.now(),
      name: newClassName.trim(),
      students: [],
      attendance: [],
    };
    saveClasses([...classes, newClass]);
    setNewClassName('');
  };

  const handleDeleteClass = (classId) => {
    setClassToDelete(classId);
    setConfirmModalOpen(true);
  };

  const confirmDeleteClass = () => {
    const updatedClasses = classes.filter((c) => c.id !== classToDelete);
    saveClasses(updatedClasses);
    setConfirmModalOpen(false);
    setClassToDelete(null);
  };

  const toggleDropdown = (classId) => {
    if (activeDropdown === classId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(classId);
    }
  };

  return (
    <div className="dashboard-container">
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeleteClass}
        title="Delete Class"
        message="Are you sure you want to delete this class? This will also delete all associated student and attendance data. This action cannot be undone."
        confirmText="Delete"
      />

      <div className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome, {user.name || 'Teacher'}!</h1>
          <p>Here is your dashboard for today.</p>
        </div>
        <div className="live-clock">
          {time.toLocaleTimeString('en-US', { hour12: timeFormat === '12h' })}
        </div>
      </div>

      <div className="add-class-container">
        <form onSubmit={handleAddClass} className="add-class-form-inline">
          <input
            type="text"
            placeholder="New Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button type="submit">
            <i className='bx bx-plus'></i> Add Class
          </button>
        </form>
      </div>

      <div className="class-list">
        {classes.map((c) => (
          <div key={c.id} className="class-card">
            <div className="class-card-header">
              <h3>{c.name}</h3>
              <div className="class-settings">
                <button className="settings-btn" onClick={() => toggleDropdown(c.id)}>
                  <i className='bx bx-cog'></i>
                </button>
                <div className={`settings-dropdown ${activeDropdown === c.id ? 'active' : ''}`}>
                  <Link to={`/class/${c.id}`}>Manage Students</Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClass(c.id); }}>Delete Class</a>
                </div>
              </div>
            </div>
            <div className="class-card-body">
              <p>{c.students.length} Students</p>
            </div>
            <div className="class-card-footer">
              <Link to={`/class/${c.id}`} className="view-class-btn">View Class</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage; 