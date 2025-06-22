import React, { useRef } from 'react';
import { useReactToPrint } from '../hooks/useReactToPrint';
// import html2canvas from 'html2canvas'; // Would be used for download
import './ReportViewer.css';

const ReportViewer = ({ report, student, className, schoolDetails, onClose }) => {
  const componentRef = useRef();
  const { triggerRef } = useReactToPrint({
    content: () => componentRef.current,
  });

  const overallPercentage = () => {
    if (!report || !report.subjects || report.subjects.length === 0) return '0.00';
    const totalMarks = report.subjects.reduce((acc, sub) => acc + Number(sub.totalMarks || 0), 0);
    const scoredMarks = report.subjects.reduce((acc, sub) => acc + Number(sub.marks || 0), 0);
    return totalMarks > 0 ? ((scoredMarks / totalMarks) * 100).toFixed(2) : '0.00';
  };

  const overallGrade = () => {
    const percentage = parseFloat(overallPercentage());
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };
  
  // const handleDownload = () => {
  //   if (reportRef.current) {
  //     html2canvas(reportRef.current).then(canvas => {
  //       const link = document.createElement('a');
  //       link.download = `report-${student.name}.jpg`;
  //       link.href = canvas.toDataURL('image/jpeg');
  //       link.click();
  //     });
  //   }
  // };

  if (!report) return null;

  return (
    <div className="report-viewer-backdrop">
      <div className="report-viewer-content">
        <div className="report-sheet" ref={componentRef}>
          <div className="report-header">
            {schoolDetails.logo && <img src={schoolDetails.logo} alt="School Logo" className="school-logo" />}
            <div className="school-info">
              <h2>{schoolDetails.name || 'School Name'}</h2>
              <p>Affiliation No: {schoolDetails.affiliationNo || 'N/A'}</p>
            </div>
          </div>
          <h3>Student Report Card</h3>
          <div className="student-details-grid">
            <p><strong>Student:</strong> {student ? student.name : 'N/A'}</p>
            <p><strong>Class:</strong> {className}</p>
            <p><strong>Register No:</strong> {student ? student.regNo : 'N/A'}</p>
            <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
          <table className="grades-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {report.subjects && report.subjects.length > 0 ? (
                report.subjects.map((sub, index) => (
                  <tr key={index}>
                    <td>{sub.name}</td>
                    <td>{sub.marks}</td>
                    <td>{sub.totalMarks}</td>
                    <td>{sub.grade}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No subject data available for this report.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="summary-section">
            <p><strong>Overall Percentage:</strong> {overallPercentage()}%</p>
            <p><strong>Overall Grade:</strong> {overallGrade()}</p>
          </div>
          <div className="remarks-section">
            <h4>Remarks:</h4>
            <p>{report.remarks || 'No remarks.'}</p>
          </div>
        </div>
        <div className="report-viewer-actions">
           {/* <button onClick={handleDownload} className="download-btn">Download as JPG</button> */}
           <button ref={triggerRef} className="print-btn">Print / Save as PDF</button>
           <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer; 