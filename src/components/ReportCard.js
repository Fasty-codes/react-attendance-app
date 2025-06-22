import React from 'react';
import './ReportCard.css';

const ReportCard = ({ report, student, className, onEdit, onDelete, onView }) => {
  const overallPercentage = () => {
    const totalMarks = report.subjects.reduce((acc, sub) => acc + Number(sub.totalMarks || 0), 0);
    const scoredMarks = report.subjects.reduce((acc, sub) => acc + Number(sub.marks || 0), 0);
    return totalMarks > 0 ? ((scoredMarks / totalMarks) * 100).toFixed(2) : 0;
  };

  return (
    <div className="report-card">
      <div className="report-card-header">
        <h4>{student ? student.name : 'Unknown Student'}</h4>
        <div className="report-actions">
          <button onClick={() => onView(report)} className="action-btn view-btn">View</button>
          <button onClick={() => onEdit(report)} className="action-btn edit-btn">Edit</button>
          <button onClick={() => onDelete(report.id)} className="action-btn delete-btn">Delete</button>
        </div>
      </div>
      <div className="report-card-body">
        <p><strong>Class:</strong> {className}</p>
        <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
        <p><strong>Overall Percentage:</strong> {overallPercentage()}%</p>
      </div>
    </div>
  );
};

export default ReportCard; 