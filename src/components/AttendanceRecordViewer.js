import React from 'react';
import './AttendanceRecordViewer.css';

const AttendanceRecordViewer = ({ record, onClose, classDetails }) => {
  if (!record) return null;

  const getStudentName = (studentId) => {
    const student = classDetails.students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const lowerCaseStatus = (status) => status.toLowerCase();

  const presentStudents = record.students.filter(s => lowerCaseStatus(s.status) === 'present');
  const absentStudents = record.students.filter(s => lowerCaseStatus(s.status) === 'absent');
  const lateStudents = record.students.filter(s => lowerCaseStatus(s.status) === 'late');

  return (
    <div className="record-viewer-backdrop" onClick={onClose}>
      <div className="record-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="record-viewer-header">
          <h2>Attendance Details</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="record-viewer-body">
          <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
          <p><strong>Session Type:</strong> {record.type}</p>
          <div className="status-columns">
            <div className="status-column">
              <h4>Present ({presentStudents.length})</h4>
              <ul>
                {presentStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}
              </ul>
            </div>
            <div className="status-column">
              <h4>Absent ({absentStudents.length})</h4>
              <ul>
                {absentStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}
              </ul>
            </div>
            <div className="status-column">
              <h4>Late ({lateStudents.length})</h4>
              <ul>
                {lateStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecordViewer; 