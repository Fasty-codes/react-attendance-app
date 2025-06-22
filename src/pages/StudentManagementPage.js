import React, { useState } from 'react';
import './StudentManagementPage.css';

const dummyStudents = [
  { id: 101, name: 'John Doe', class: 'Class A' },
  { id: 102, name: 'Jane Smith', class: 'Class A' },
  { id: 103, name: 'Peter Jones', class: 'Class A' },
  { id: 201, name: 'Mary Williams', class: 'Class B' },
  { id: 202, name: 'David Brown', class: 'Class B' },
  { id: 301, name: 'Susan Garcia', class: 'Class C' },
  { id: 302, name: 'Robert Miller', class: 'Class C' },
  { id: 303, name: 'Linda Davis', class: 'Class C' },
  { id: 304, name: 'Michael Rodriguez', class: 'Class C' },
];

const StudentManagementPage = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName || !newStudentClass) return;

    const newStudent = {
      id: Date.now(), // simple unique id
      name: newStudentName,
      class: newStudentClass,
    };
    setStudents([...students, newStudent]);
    setNewStudentName('');
    setNewStudentClass('');
  };

  return (
    <div>
      <h1>Student Management</h1>

      <div className="add-student-form">
        <h2>Add New Student</h2>
        <form onSubmit={handleAddStudent}>
          <input
            type="text"
            placeholder="Student Name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Class"
            value={newStudentClass}
            onChange={(e) => setNewStudentClass(e.target.value)}
          />
          <button type="submit">Add Student</button>
        </form>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagementPage; 