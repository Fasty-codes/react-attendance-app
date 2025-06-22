import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Modal from '../components/Modal';
import AttendanceTaker from '../components/AttendanceTaker';
import StudentEditModal from '../components/StudentEditModal';
import TimetableEditor from '../components/TimetableEditor';
import AttendanceReportModal from '../components/AttendanceReportModal';
import AttendanceRecordViewer from '../components/AttendanceRecordViewer';
import Calendar from '../components/Calendar';
import ConfirmationModal from '../components/ConfirmationModal';
import './ClassDetailsPage.css';

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const [classDetails, setClassDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentReg, setNewStudentReg] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [sessionType, setSessionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewingAttendanceRecord, setViewingAttendanceRecord] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });
  const [events, setEvents] = useState([]);

  // Load class and student data from localStorage
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const foundClass = storedClasses.find(c => c.id.toString() === classId);
    if (foundClass) {
      setClassDetails(foundClass);
      setStudents(foundClass.students || []);
      setEvents(foundClass.events || []);
    }
  }, [classId, user.id]);

  const startSession = (type) => {
    setSessionType(type);
    setModalOpen(false);
  };

  if (sessionType) {
    return <AttendanceTaker classDetails={classDetails} sessionType={sessionType} onSessionEnd={() => {
      // Refresh data after session ends
      const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
      const foundClass = storedClasses.find(c => c.id.toString() === classId);
      if(foundClass) {
        setClassDetails(foundClass);
      }
      setSessionType(null)
    }} />
  }

  // Function to update and save classes
  const updateAndSaveClasses = (updatedClassDetails) => {
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const updatedClasses = storedClasses.map(c => 
      c.id.toString() === classId ? updatedClassDetails : c
    );
    localStorage.setItem(`classes_${user.id}`, JSON.stringify(updatedClasses));
  };

  const handleSaveStudent = (studentData) => {
    let updatedStudents;
    if (studentData.id) {
      // Editing existing student
      updatedStudents = students.map(s => s.id === studentData.id ? studentData : s);
    } else {
      // Adding new student
      updatedStudents = [...students, { ...studentData, id: Date.now() }];
    }
    setStudents(updatedStudents);
    const updatedClassDetails = { ...classDetails, students: updatedStudents };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentReg.trim()) return;
    const newStudent = {
      id: Date.now(),
      regNo: newStudentReg.trim(),
      name: newStudentName.trim(),
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);

    const updatedClassDetails = { ...classDetails, students: updatedStudents };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);

    setNewStudentName('');
    setNewStudentReg('');
  };

  const handleSaveTimetable = (newTimetable) => {
    const updatedClassDetails = { ...classDetails, timetable: newTimetable };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);
  };

  const onDeclareHoliday = () => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => handleDeclareHoliday(),
      title: 'Declare Holiday',
      message: 'Are you sure you want to declare a holiday for today? This action cannot be undone.'
    });
  };

  const handleDeclareHoliday = () => {
    const holidayRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'Holiday',
      students: [], // No student data for a holiday
    };

    const updatedClassDetails = {
      ...classDetails,
      attendance: [...(classDetails.attendance || []), holidayRecord],
    };

    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);
    setModalOpen(false); // Close the session select modal
    setConfirmModal({ isOpen: false }); // Close the confirmation modal
  };

  const onRemoveStudent = (studentId) => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => handleRemoveStudent(studentId),
      title: 'Remove Student',
      message: 'Are you sure you want to remove this student? All their data will be lost.'
    });
  };

  const handleRemoveStudent = (studentId) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);

    const updatedClassDetails = { ...classDetails, students: updatedStudents };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);
    setConfirmModal({ isOpen: false }); // Close the confirmation modal
  };

  const handleAddEvent = (eventData) => {
    const newEvent = { ...eventData, id: Date.now() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    const updatedClassDetails = { ...classDetails, events: updatedEvents };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);

    const areNotificationsEnabled = JSON.parse(localStorage.getItem('showNotifications')) ?? true;
    if (areNotificationsEnabled) {
      showNotification(`Event "${newEvent.title}" added successfully!`, 'success');
    }
  };

  if (!classDetails) {
    return <div>Loading class details...</div>;
  }

  const filteredHistory = (classDetails.attendance || []).filter(record => 
    record && record.date && record.date.includes(searchTerm)
  );

  return (
    <div className="class-details-container">
      <div className="class-details-header">
        <h1>{classDetails.name}</h1>
        <button className="start-day-btn" onClick={() => setModalOpen(true)}>
          <i className='bx bx-sun'></i> Start New Day
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div className="session-select-modal">
          <h2>Select Session Type</h2>
          <p>Choose the type of attendance session to start for today.</p>
          <div className="session-options">
            <button onClick={() => startSession('Full Day')}>
              <i className='bx bx-user-check'></i> Full Day
            </button>
            <button onClick={() => startSession('Half Day')}>
              <i className='bx bx-user-minus'></i> Half Day
            </button>
            <button onClick={onDeclareHoliday} className="holiday-btn">
              <i className='bx bx-calendar-event'></i> Declare Holiday
            </button>
          </div>
        </div>
      </Modal>

      <StudentEditModal 
        isOpen={isStudentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <AttendanceReportModal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />

      <AttendanceRecordViewer
        record={viewingAttendanceRecord}
        onClose={() => setViewingAttendanceRecord(null)}
        classDetails={classDetails}
      />

      <div className="class-details-tabs">
        <button onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'active' : ''}>Students</button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>Attendance History</button>
        <button onClick={() => setActiveTab('timetable')} className={activeTab === 'timetable' ? 'active' : ''}>Timetable</button>
        <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>Calendar</button>
      </div>

      <div className="tab-content">
        {activeTab === 'students' && (
          <div className="student-management-section">
            <div className="student-list-container">
              <div className="student-list-header">
                <h2>Student List</h2>
                <button onClick={() => { setEditingStudent(null); setStudentModalOpen(true); }} className="add-student-main-btn">
                  <i className='bx bx-user-plus'></i> Add Student
                </button>
              </div>
              <table className="student-list-table">
                <thead>
                  <tr>
                    <th>Roll No.</th>
                    <th>Name</th>
                    <th>Register No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.regNo}</td>
                        <td>
                          <button onClick={() => { setEditingStudent(student); setStudentModalOpen(true); }} className="action-btn edit">
                            <i className='bx bxs-edit'></i>
                          </button>
                          <button onClick={() => onRemoveStudent(student.id)} className="action-btn delete">
                            <i className='bx bxs-trash'></i>
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="attendance-history-section">
            <div className="attendance-history-header">
              <h2>Attendance History</h2>
              <input
                type="text"
                placeholder="Search by date (YYYY-MM-DD)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="history-search-bar"
              />
            </div>
            <div className="history-list">
              {filteredHistory.length > 0 ? (
                <ul className="history-list-items">
                  {filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map(record => {
                    const studentRecords = record.students || [];
                    const presentCount = studentRecords.filter(s => s.status === 'Present').length;
                    const absentCount = studentRecords.filter(s => s.status === 'Absent').length;
                    const lateCount = studentRecords.filter(s => s.status === 'Late').length;

                    return (
                      <li key={record.id} className={`history-list-item ${record.type === 'Holiday' ? 'holiday-item' : ''}`}
                        onClick={() => record.type !== 'Holiday' && setViewingAttendanceRecord(record)}
                      >
                        <div className="history-item-info">
                          <strong>{new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                          <span>{record.type}</span>
                        </div>
                        {record.type !== 'Holiday' ? (
                          <div className="history-item-stats">
                            <div>
                              <div className="stat-value" style={{color: '#28a745'}}>{presentCount}</div>
                              <div className="stat-label">Present</div>
                            </div>
                            <div>
                              <div className="stat-value" style={{color: '#dc3545'}}>{absentCount}</div>
                              <div className="stat-label">Absent</div>
                            </div>
                            <div>
                              <div className="stat-value" style={{color: '#ffc107'}}>{lateCount}</div>
                              <div className="stat-label">Late</div>
                            </div>
                          </div>
                        ) : (
                          <div className="holiday-text">
                            <i className='bx bx-calendar-event'></i> Holiday Declared
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No attendance records found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="timetable-container">
            <TimetableEditor initialTimetable={classDetails.timetable || {}} onSave={handleSaveTimetable} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="calendar-view-container">
            <Calendar 
              attendanceData={classDetails.attendance || []} 
              events={events}
              onAddEvent={handleAddEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailsPage;
