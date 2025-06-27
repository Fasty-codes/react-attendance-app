import React, { useState } from 'react';
import Modal from './Modal';
import './EditAttendanceModal.css';

const EditAttendanceModal = ({ record, classDetails, onSave, onClose }) => {
  const [type, setType] = useState(record?.type || 'Full Day');
  const [holidayType, setHolidayType] = useState(record?.holidayType || 'Public');
  const [customHolidayName, setCustomHolidayName] = useState(record?.customHolidayName || '');
  const [students, setStudents] = useState(
    record?.students
      ? record.students.map(s => ({ ...s }))
      : (classDetails.students || []).map(s => ({ id: s.id, status: 'present' }))
  );

  if (!record) return null;

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSave = () => {
    onSave({
      ...record,
      type,
      holidayType: type === 'Holiday' ? holidayType : undefined,
      customHolidayName: type === 'Holiday' && holidayType === 'Custom' ? customHolidayName : undefined,
      students: type === 'Holiday' ? [] : students
    });
  };

  return (
    <Modal isOpen={!!record} onClose={onClose}>
      <div className="edit-attendance-modal">
        <h2>Edit Attendance Record</h2>
        <div className="edit-field">
          <label>Day Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Full Day">Full Day</option>
            <option value="Half Day">Half Day</option>
            <option value="Holiday">Holiday</option>
          </select>
        </div>
        {type === 'Holiday' && (
          <>
            <div className="edit-field">
              <label>Holiday Type</label>
              <select value={holidayType} onChange={e => setHolidayType(e.target.value)}>
                <option value="Public">Public Holiday</option>
                <option value="Exam">Exam Holiday</option>
                <option value="Custom">Custom Holiday</option>
              </select>
            </div>
            {holidayType === 'Custom' && (
              <div className="edit-field">
                <label>Custom Holiday Name</label>
                <input type="text" value={customHolidayName} onChange={e => setCustomHolidayName(e.target.value)} placeholder="Enter holiday name..." />
              </div>
            )}
          </>
        )}
        {type !== 'Holiday' && (
          <div className="edit-field">
            <label>Edit Student Attendance</label>
            <div className="edit-student-list">
              {classDetails.students.map(student => {
                const s = students.find(stu => stu.id === student.id) || { status: 'present' };
                return (
                  <div key={student.id} className="edit-student-row">
                    <span>{student.name}</span>
                    <select value={s.status} onChange={e => handleStatusChange(student.id, e.target.value)}>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="edit-attendance-actions">
          <button className="edit-attendance-cancel" onClick={onClose}>Cancel</button>
          <button className="edit-attendance-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditAttendanceModal; 