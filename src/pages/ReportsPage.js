import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import ReportGenerator from '../components/ReportGenerator';
import ReportCard from '../components/ReportCard';
import ConfirmationModal from '../components/ConfirmationModal';
import ReportViewer from '../components/ReportViewer';
import './ReportsPage.css';

const ReportsPage = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem(`reports_${user.id}`)) || [];
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    setReports(storedReports);
    setClasses(storedClasses);
  }, [user.id]);

  const handleSaveReport = (reportData) => {
    let updatedReports;
    if (reportData.id) {
      // Update existing report
      updatedReports = reports.map(r => r.id === reportData.id ? reportData : r);
    } else {
      // Add new report
      const newReport = { ...reportData, id: Date.now() };
      updatedReports = [...reports, newReport];
    }
    setReports(updatedReports);
    localStorage.setItem(`reports_${user.id}`, JSON.stringify(updatedReports));
    setEditingReport(null); // Close the editor view
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
  };

  const handleDeleteReport = (reportId) => {
    setReportToDelete(reportId);
    setConfirmModalOpen(true);
  };

  const confirmDeleteReport = () => {
    const updatedReports = reports.filter(r => r.id !== reportToDelete);
    setReports(updatedReports);
    localStorage.setItem(`reports_${user.id}`, JSON.stringify(updatedReports));
    setConfirmModalOpen(false);
    setReportToDelete(null);
  };

  const findStudentAndClass = (report) => {
    const classInfo = classes.find(c => c.id.toString() === report.classId);
    if (!classInfo) return { student: null, className: 'Unknown' };
    const studentInfo = classInfo.students.find(s => s.id.toString() === report.studentId);
    return { student: studentInfo, className: classInfo.name };
  };

  const schoolDetails = {
    name: localStorage.getItem('schoolName') || 'My School',
    affiliationNo: localStorage.getItem('affiliationNo') || 'N/A',
    logo: localStorage.getItem('schoolLogo') || '',
  };

  return (
    <div className="reports-container">
      {viewingReport && (
        <ReportViewer
          report={viewingReport}
          student={findStudentAndClass(viewingReport).student}
          className={findStudentAndClass(viewingReport).className}
          schoolDetails={schoolDetails}
          onClose={() => setViewingReport(null)}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeleteReport}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete"
      />
      <h1>Reports</h1>
      <div className="reports-layout">
        <div className="report-generator-container">
          <ReportGenerator 
            onSaveReport={handleSaveReport}
            classes={classes}
            initialReport={editingReport}
            onCancel={() => setEditingReport(null)}
          />
        </div>
        <div className="reports-list-container">
          <h2>Generated Reports</h2>
          <div className="reports-list">
            {reports.map(report => {
              const { student, className } = findStudentAndClass(report);
              return (
                <ReportCard
                  key={report.id}
                  report={report}
                  student={student}
                  className={className}
                  onDelete={handleDeleteReport}
                  onEdit={handleEditReport}
                  onView={setViewingReport}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 