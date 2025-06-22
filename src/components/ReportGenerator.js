import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ReportGenerator.css';

const ReportGenerator = ({ onSaveReport, classes, initialReport, onCancel }) => {
  const { user } = useContext(AuthContext);
  const classesData = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subjects, setSubjects] = useState([{ name: '', grade: '', marks: '', totalMarks: '' }]);
  const [remarks, setRemarks] = useState('');
  
  useEffect(() => {
    if (initialReport) {
      setSelectedClass(initialReport.classId || '');
      setSelectedStudent(initialReport.studentId || '');
      setSubjects(initialReport.subjects || [{ name: '', grade: '', marks: '', totalMarks: '' }]);
      setRemarks(initialReport.remarks || '');
    } else {
      // Reset form when initialReport is null (i.e., not in edit mode)
      setSelectedClass('');
      setSelectedStudent('');
      setSubjects([{ name: '', grade: '', marks: '', totalMarks: '' }]);
      setRemarks('');
    }
  }, [initialReport]);

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', grade: '', marks: '', totalMarks: '' }]);
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      ...initialReport, // This will include the id if we are editing
      classId: selectedClass,
      studentId: selectedStudent,
      subjects,
      remarks,
      createdAt: new Date().toISOString(),
    };
    onSaveReport(reportData);
  };

  const currentClass = classesData.find(c => c.id.toString() === selectedClass);

  return (
    <form onSubmit={handleSubmit} className="report-generator-form">
      <h3>{initialReport ? 'Edit Report' : 'Create New Report'}</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
            <option value="">Select a Class</option>
            {classesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Student</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required disabled={!selectedClass}>
            <option value="">Select a Student</option>
            {currentClass && currentClass.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <h4>Subjects</h4>
      {subjects.map((subject, index) => (
        <div key={index} className="subject-row">
          <input type="text" placeholder="Subject Name" value={subject.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} />
          <input type="text" placeholder="Grade" value={subject.grade} onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)} />
          <input type="number" placeholder="Marks" value={subject.marks} onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)} />
          <input type="number" placeholder="Total Marks" value={subject.totalMarks} onChange={(e) => handleSubjectChange(index, 'totalMarks', e.target.value)} />
          <button type="button" onClick={() => removeSubject(index)} className="remove-subject-btn">X</button>
        </div>
      ))}
      <button type="button" onClick={addSubject} className="add-subject-btn">Add Subject</button>

      <h4>Remarks</h4>
      <textarea placeholder="Add overall remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>

      <div className="form-actions">
        <button type="submit" className="save-report-btn">
          {initialReport ? 'Save Changes' : 'Save Report'}
        </button>
        {initialReport && (
          <button type="button" onClick={onCancel} className="cancel-edit-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReportGenerator; 