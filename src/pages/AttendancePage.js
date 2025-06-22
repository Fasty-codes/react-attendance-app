import React, { useState } from 'react';
import './AttendancePage.css';

const dummyClasses = [
  { id: 1, name: 'Class A' },
  { id: 2, name: 'Class B' },
  { id: 3, name: 'Class C' },
];

const dummyStudents = {
  1: [
    { id: 101, name: 'John Doe' },
    { id: 102, name: 'Jane Smith' },
    { id: 103, name: 'Peter Jones' },
  ],
  2: [
    { id: 201, name: 'Mary Williams' },
    { id: 202, name: 'David Brown' },
  ],
  3: [
    { id: 301, name: 'Susan Garcia' },
    { id: 302, name: 'Robert Miller' },
    { id: 303, name: 'Linda Davis' },
    { id: 304, name: 'Michael Rodriguez' },
  ],
};

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(dummyClasses[0].id);
  const [students, setStudents] = useState(dummyStudents[selectedClass]);
  const [attendance, setAttendance] = useState({});

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setStudents(dummyStudents[classId]);
    setAttendance({});
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: status,
    });
  };

  const handleSubmit = () => {
    // In a real app, you would send this data to a server
    console.log('Submitting attendance:', {
      classId: selectedClass,
      date: new Date().toISOString().slice(0, 10),
      attendance,
    });
    alert('Attendance submitted!');
  };

  return (
    <div>
      <h1>Attendance</h1>
      <div className="attendance-header">
        <label htmlFor="class-select">Select Class:</label>
        <select id="class-select" value={selectedClass} onChange={handleClassChange}>
          {dummyClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <div className="attendance-buttons">
                  <button
                    className={attendance[student.id] === 'present' ? 'active' : ''}
                    onClick={() => handleAttendanceChange(student.id, 'present')}
                  >
                    Present
                  </button>
                  <button
                    className={attendance[student.id] === 'absent' ? 'active' : ''}
                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                  >
                    Absent
                  </button>
                  <button
                    className={attendance[student.id] === 'late' ? 'active' : ''}
                    onClick={() => handleAttendanceChange(student.id, 'late')}
                  >
                    Late
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="submit-btn" onClick={handleSubmit}>Submit Attendance</button>
    </div>
  );
};

export default AttendancePage; 