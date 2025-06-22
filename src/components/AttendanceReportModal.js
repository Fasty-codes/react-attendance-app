import React from 'react';
import Modal from './Modal';
import './AttendanceReportModal.css';

const AttendanceReportModal = ({ isOpen, onClose, report }) => {
  if (!report) return null;

  const presentStudents = report.students.filter(s => s.status === 'present');
  const absentStudents = report.students.filter(s => s.status === 'absent');
  const lateStudents = report.students.filter(s => s.status === 'late');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="attendance-report-modal">
        <h2>Attendance for {new Date(report.date).toLocaleDateString()}</h2>
        <p><strong>Session:</strong> {report.type}</p>
        
        <div className="report-columns">
          <div className="report-column">
            <h3>Present ({presentStudents.length})</h3>
            <ul>
              {presentStudents.map(student => <li key={student.id}>{student.name}</li>)}
            </ul>
          </div>
          <div className="report-column">
            <h3>Absent ({absentStudents.length})</h3>
            <ul>
              {absentStudents.map(student => <li key={student.id}>{student.name}</li>)}
            </ul>
          </div>
          {lateStudents.length > 0 && (
            <div className="report-column">
              <h3>Late ({lateStudents.length})</h3>
              <ul>
                {lateStudents.map(student => <li key={student.id}>{student.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceReportModal; 