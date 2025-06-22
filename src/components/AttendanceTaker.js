import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './AttendanceTaker.css';

const AttendanceTaker = ({ classDetails, sessionType, onSessionEnd }) => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleFinish = () => {
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: sessionType,
      attendance: attendance,
    };

    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const updatedClasses = storedClasses.map(c => {
      if (c.id === classDetails.id) {
        return { ...c, attendance: [...(c.attendance || []), newRecord] };
      }
      return c;
    });
    localStorage.setItem(`classes_${user.id}`, JSON.stringify(updatedClasses));
    setIsFinished(true);
  };
  
  const getStats = () => {
    const total = classDetails.students.length;
    const present = Object.values(attendance).filter(s => s === 'present').length;
    const absent = Object.values(attendance).filter(s => s === 'absent').length;
    const late = Object.values(attendance).filter(s => s === 'late').length;
    return { total, present, absent, late };
  };

  if (isFinished) {
    const stats = getStats();
    return (
      <div className="attendance-container">
        <h1>Attendance Summary</h1>
        <h2>{classDetails.name} - {sessionType} on {new Date().toLocaleDateString()}</h2>
        <div className="stats-grid">
          <div className="stat-item"><span>{stats.total}</span> Total Students</div>
          <div className="stat-item"><span>{stats.present}</span> Present</div>
          <div className="stat-item"><span>{stats.absent}</span> Absent</div>
          <div className="stat-item"><span>{stats.late}</span> Late</div>
        </div>
        <button onClick={onSessionEnd} className="back-to-class-btn">Back to Class Details</button>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <h1>Take Attendance</h1>
      <h2>{classDetails.name} - {sessionType}</h2>
      <table className="attendance-taker-table">
        <thead>
          <tr>
            <th>Reg. No.</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classDetails.students.map(student => (
            <tr key={student.id}>
              <td>{student.regNo}</td>
              <td>{student.name}</td>
              <td>
                <div className="attendance-action-buttons">
                  <button 
                    className={`present-btn ${attendance[student.id] === 'present' ? 'active' : ''}`}
                    onClick={() => handleAttendanceChange(student.id, 'present')}>Present</button>
                  <button 
                    className={`absent-btn ${attendance[student.id] === 'absent' ? 'active' : ''}`}
                    onClick={() => handleAttendanceChange(student.id, 'absent')}>Absent</button>
                  <button 
                    className={`late-btn ${attendance[student.id] === 'late' ? 'active' : ''}`}
                    onClick={() => handleAttendanceChange(student.id, 'late')}>Late</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleFinish} className="finish-attendance-btn">Finish</button>
    </div>
  );
};

export default AttendanceTaker; 