import React, { useState, useContext, useEffect } from 'react';
import './AttendanceRecordViewer.css';
import { SidebarContext } from './AppLayout';

const AttendanceRecordViewer = ({ record, onClose, classDetails }) => {
  const [openList, setOpenList] = useState(null); // 'present' | 'absent' | 'late' | null
  const { setSidebarCollapsed } = useContext(SidebarContext);

  useEffect(() => {
    // Only hide sidebar on mobile when popup is open
    if (record && window.innerWidth <= 700) {
      setSidebarCollapsed(true);
    }
    return () => {
      if (window.innerWidth <= 700) setSidebarCollapsed(false);
    };
  }, [record, setSidebarCollapsed]);

  if (!record) return null;

  const getStudentName = (studentId) => {
    const student = classDetails.students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const lowerCaseStatus = (status) => status.toLowerCase();

  const studentsArr = record.students || [];
  const total = classDetails.students.length;
  const presentStudents = studentsArr.filter(s => lowerCaseStatus(s.status) === 'present');
  const absentStudents = studentsArr.filter(s => lowerCaseStatus(s.status) === 'absent');
  const lateStudents = studentsArr.filter(s => lowerCaseStatus(s.status) === 'late');

  const presentPercent = total ? ((presentStudents.length / total) * 100).toFixed(1) : 0;
  const absentPercent = total ? ((absentStudents.length / total) * 100).toFixed(1) : 0;
  const latePercent = total ? ((lateStudents.length / total) * 100).toFixed(1) : 0;

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
          {studentsArr.length === 0 ? (
            <div className="no-attendance-msg">No attendance data available for this session.</div>
          ) : (
            <>
              <div className="modal-stats-grid clickable-stats">
                <div className={`modal-stat present${openList==='present' ? ' open' : ''}`} onClick={() => setOpenList(openList==='present'?null:'present')}>
                  <span>{presentStudents.length}</span>
                  <small>Present</small>
                  <div className="modal-stat-percent">{presentPercent}%</div>
                </div>
                <div className={`modal-stat absent${openList==='absent' ? ' open' : ''}`} onClick={() => setOpenList(openList==='absent'?null:'absent')}>
                  <span>{absentStudents.length}</span>
                  <small>Absent</small>
                  <div className="modal-stat-percent">{absentPercent}%</div>
                </div>
                <div className={`modal-stat late${openList==='late' ? ' open' : ''}`} onClick={() => setOpenList(openList==='late'?null:'late')}>
                  <span>{lateStudents.length}</span>
                  <small>Late</small>
                  <div className="modal-stat-percent">{latePercent}%</div>
                </div>
              </div>
              {openList === 'present' && (
                <div className="modal-student-list"><strong>Present Students:</strong>
                  <ul>{presentStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}</ul>
                </div>
              )}
              {openList === 'absent' && (
                <div className="modal-student-list"><strong>Absent Students:</strong>
                  <ul>{absentStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}</ul>
                </div>
              )}
              {openList === 'late' && (
                <div className="modal-student-list"><strong>Late Students:</strong>
                  <ul>{lateStudents.map(s => <li key={s.id}>{getStudentName(s.id)}</li>)}</ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecordViewer; 