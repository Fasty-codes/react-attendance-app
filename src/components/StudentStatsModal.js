import React, { useState } from 'react';
import Modal from './Modal';
import './StudentStatsModal.css';

const StudentStatsModal = ({ student, classDetails, onClose }) => {
  const [openList, setOpenList] = useState(null); // 'present' | 'absent' | 'late' | null
  if (!student) return null;
  const attendanceRecords = (classDetails.attendance || []).filter(r => r.students && r.students.some(s => s.id === student.id));
  const total = attendanceRecords.length;

  // Group records by status
  const presentRecords = attendanceRecords.filter(r => r.students.find(s => s.id === student.id && s.status === 'present'));
  const absentRecords = attendanceRecords.filter(r => r.students.find(s => s.id === student.id && s.status === 'absent'));
  const lateRecords = attendanceRecords.filter(r => r.students.find(s => s.id === student.id && s.status === 'late'));

  // Cumulative stats for the student
  const presentPercent = total ? ((presentRecords.length / total) * 100).toFixed(1) : '0.0';
  const absentPercent = total ? ((absentRecords.length / total) * 100).toFixed(1) : '0.0';
  const latePercent = total ? ((lateRecords.length / total) * 100).toFixed(1) : '0.0';

  return (
    <Modal isOpen={!!student} onClose={onClose}>
      <div className="student-stats-modal">
        <h2>Attendance Stats for {student.name}</h2>
        {total === 0 ? (
          <div style={{textAlign:'center',color:'#888',margin:'2.5rem 0 2rem 0',fontSize:'1.08rem',fontWeight:500}}>
            No attendance records found for this student yet.
          </div>
        ) : (
          <>
            <div className="student-stats-grid">
              <div className={`student-stat present${openList==='present' ? ' open' : ''}`} onClick={() => setOpenList(openList==='present'?null:'present')} style={{cursor:'pointer'}}>
                <span>{presentRecords.length}</span>
                <small>Present</small>
                <div className="student-stat-percent">{presentPercent}%</div>
              </div>
              <div className={`student-stat absent${openList==='absent' ? ' open' : ''}`} onClick={() => setOpenList(openList==='absent'?null:'absent')} style={{cursor:'pointer'}}>
                <span>{absentRecords.length}</span>
                <small>Absent</small>
                <div className="student-stat-percent">{absentPercent}%</div>
              </div>
              <div className={`student-stat late`} style={{cursor:'default'}}>
                <span>{lateRecords.length}</span>
                <small>Late</small>
                <div className="student-stat-percent">{latePercent}%</div>
              </div>
            </div>
            <div className="student-stats-meta">Total Sessions: {total}</div>
            {openList === 'present' && (
              <div className="modal-student-list"><strong>Present Sessions:</strong>
                <ul>{presentRecords.map(r => (
                  <li key={r.id}>{new Date(r.date).toLocaleDateString()} <span style={{color:'#888',fontSize:'0.97em'}}>({r.type})</span></li>
                ))}</ul>
              </div>
            )}
            {openList === 'absent' && (
              <div className="modal-student-list"><strong>Absent Sessions:</strong>
                <ul>{absentRecords.map(r => (
                  <li key={r.id}>{new Date(r.date).toLocaleDateString()} <span style={{color:'#888',fontSize:'0.97em'}}>({r.type})</span></li>
                ))}</ul>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default StudentStatsModal; 