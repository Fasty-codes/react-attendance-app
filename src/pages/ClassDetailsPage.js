import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Modal from '../components/Modal';
import AttendanceTaker from '../components/AttendanceTaker';
import StudentEditModal from '../components/StudentEditModal';
import AttendanceReportModal from '../components/AttendanceReportModal';
import AttendanceRecordViewer from '../components/AttendanceRecordViewer';
import Calendar from '../components/Calendar';
import ConfirmationModal from '../components/ConfirmationModal';
import StudentStatsModal from '../components/StudentStatsModal';
import EditAttendanceModal from '../components/EditAttendanceModal';
import TimetableDayEditor from '../components/TimetableDayEditor';
import InfoModal from '../components/InfoModal';
import { SidebarContext } from '../components/AppLayout';
import './ClassDetailsPage.css';

const ClassDetailsPage = () => {
  const { setSidebarCollapsed } = useContext(SidebarContext);
  const { classId } = useParams();
  const navigate = useNavigate();
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
  const [todaysAttendance, setTodaysAttendance] = useState(null);
  const [viewingStudentStats, setViewingStudentStats] = useState(null);
  const [editingAttendanceRecord, setEditingAttendanceRecord] = useState(null);
  const [deletingAttendanceRecord, setDeletingAttendanceRecord] = useState(null);
  const [isTimetableEditing, setIsTimetableEditing] = useState(false);
  const [activeTimetableDay, setActiveTimetableDay] = useState('Monday');
  const [studentListModal, setStudentListModal] = useState({ isOpen: false, title: '', students: [] });
  const [holidayName, setHolidayName] = useState('');

  useEffect(() => {
    // Let AttendanceRecordViewer handle sidebar on mobile
    if (window.innerWidth <= 700 && viewingAttendanceRecord) return;
    const anyModalOpen =
      viewingStudentStats ||
      editingAttendanceRecord ||
      studentListModal.isOpen ||
      isStudentModalOpen ||
      isModalOpen ||
      confirmModal.isOpen;
    if (anyModalOpen) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [viewingAttendanceRecord, viewingStudentStats, editingAttendanceRecord, studentListModal.isOpen, isStudentModalOpen, isModalOpen, confirmModal.isOpen, setSidebarCollapsed]);

  // Load class and student data from localStorage
  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const foundClass = storedClasses.find(c => c.id.toString() === classId);
    if (foundClass) {
      setClassDetails(foundClass);
      setStudents(foundClass.students || []);
      setEvents(foundClass.events || []);

      const todayStr = new Date().toISOString().slice(0, 10);
      const todayRecord = (foundClass.attendance || []).find(rec => rec.date === todayStr);
      setTodaysAttendance(todayRecord);

      if (!foundClass.timetable) {
        // Initialize with empty timetable if not present
        const newTimetable = generateEmptyTimetable();
        foundClass.timetable = newTimetable;
        // Directly saving it back to have a valid timetable structure
        const updatedClasses = storedClasses.map(c => c.id.toString() === classId ? foundClass : c);
        localStorage.setItem(`classes_${user.id}`, JSON.stringify(updatedClasses));
      }
    }
  }, [classId, user.id]);

  const generateEmptyTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetable = {};
    days.forEach(day => {
        timetable[day] = Array.from({ length: 10 }, (_, i) => ({
            period: i + 1,
            subject: '',
            teacher: '',
            time: ''
        }));
    });
    return timetable;
  };

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
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayRecord = (foundClass.attendance || []).find(rec => rec.date === todayStr);
        setTodaysAttendance(todayRecord);
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

  const onDeclareHoliday = () => {
    setConfirmModal({
      isOpen: true,
      onConfirm: () => handleDeclareHoliday(),
      title: 'Declare Holiday',
      message: '', // We'll show a custom modal below
    });
  };

  const handleDeclareHoliday = () => {
    const holidayRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: 'Holiday',
      holidayName: holidayName.trim() ? holidayName.trim() : undefined,
      students: [],
    };
    const updatedClassDetails = {
      ...classDetails,
      attendance: [...(classDetails.attendance || []), holidayRecord],
    };
    setClassDetails(updatedClassDetails);
    updateAndSaveClasses(updatedClassDetails);
    setModalOpen(false);
    setConfirmModal({ isOpen: false });
    setHolidayName('');
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

  const getLiveStats = () => {
    if (!todaysAttendance || !todaysAttendance.students) return null;

    const total = students.length;
    if (total === 0) return null;
    
    const presentCount = todaysAttendance.students.filter(s => s.status === 'present').length;
    const absentCount = todaysAttendance.students.filter(s => s.status === 'absent').length;
    const lateCount = todaysAttendance.students.filter(s => s.status === 'late').length;

    return {
      present: {
        count: presentCount,
        percent: ((presentCount / total) * 100).toFixed(1),
      },
      absent: {
        count: absentCount,
        percent: ((absentCount / total) * 100).toFixed(1),
      },
      late: {
        count: lateCount,
        percent: ((lateCount / total) * 100).toFixed(1),
      },
    };
  };

  const liveStats = getLiveStats();

  // Calculate all-sessions stats: present, absent, late, sessions (days), holidays, full days, half days
  const getCumulativeStats = () => {
    const attendanceRecords = classDetails.attendance || [];
    let sessions = 0, holidays = 0, fullDays = 0, halfDays = 0;
    let presentCounts = {}, absentCounts = {}, lateCounts = {};
    attendanceRecords.forEach(record => {
      if (record.type === 'Holiday') holidays++;
      if (record.type === 'Full Day') fullDays++;
      if (record.type === 'Half Day') halfDays++;
      if (record.students && record.students.length > 0) {
        sessions++;
        record.students.forEach(s => {
          if (s.status === 'present') presentCounts[s.id] = (presentCounts[s.id] || 0) + 1;
          if (s.status === 'absent') absentCounts[s.id] = (absentCounts[s.id] || 0) + 1;
          if (s.status === 'late') lateCounts[s.id] = (lateCounts[s.id] || 0) + 1;
        });
      }
    });
    const totalPresent = Object.values(presentCounts).reduce((a, b) => a + b, 0);
    const totalAbsent = Object.values(absentCounts).reduce((a, b) => a + b, 0);
    const totalLate = Object.values(lateCounts).reduce((a, b) => a + b, 0);
    return {
      sessions,
      holidays,
      fullDays,
      halfDays,
      totalPresent,
      totalAbsent,
      totalLate,
      percentPresent: sessions ? ((totalPresent / (sessions * classDetails.students.length)) * 100).toFixed(1) : '0.0',
      percentAbsent: sessions ? ((totalAbsent / (sessions * classDetails.students.length)) * 100).toFixed(1) : '0.0',
      percentLate: sessions ? ((totalLate / (sessions * classDetails.students.length)) * 100).toFixed(1) : '0.0',
      presentCounts,
      absentCounts,
      lateCounts
    };
  };
  const cumulativeStats = getCumulativeStats();

  const handleTimetableUpdate = (day, updatedPeriods) => {
    const newTimetable = {
      ...classDetails.timetable,
      [day]: updatedPeriods,
    };
    setClassDetails({ ...classDetails, timetable: newTimetable });
  };

  const handleAddPeriod = (day) => {
    const dayPeriods = classDetails.timetable[day] || [];
    if (dayPeriods.length < 10) {
      const newPeriod = { period: dayPeriods.length + 1, subject: '', teacher: '', time: '' };
      const updatedPeriods = [...dayPeriods, newPeriod];
      handleTimetableUpdate(day, updatedPeriods);
    }
  };

  const handleRemovePeriod = (day, periodIndex) => {
    const dayPeriods = classDetails.timetable[day] || [];
    const updatedPeriods = dayPeriods.filter((_, i) => i !== periodIndex);
    handleTimetableUpdate(day, updatedPeriods);
  };

  const handleSaveTimetable = () => {
    updateAndSaveClasses(classDetails);
    setIsTimetableEditing(false);
    showNotification('Timetable saved successfully!', 'success');
  }

  const handleCancelTimetableEdit = () => {
    // Re-fetch original data from local storage to discard changes
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const foundClass = storedClasses.find(c => c.id.toString() === classId);
    if (foundClass) {
      setClassDetails(foundClass);
    }
    setIsTimetableEditing(false);
  }

  const handleFinish = () => {
    // Get all student IDs
    const allStudentIds = (classDetails.students || []).map(s => s.id);
    // Build attendance map with all students
    const fullAttendance = { ...attendance };
    allStudentIds.forEach(id => {
      if (!fullAttendance[id]) {
        fullAttendance[id] = 'absent';
      }
    });
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: sessionType,
      students: Object.entries(fullAttendance).map(([id, status]) => ({ id: Number(id), status })),
    };
    const storedClasses = JSON.parse(localStorage.getItem(`classes_${user.id}`)) || [];
    const updatedClasses = storedClasses.map(c => {
      if (c.id === classDetails.id) {
        return { ...c, attendance: [...(c.attendance || []), newRecord] };
      }
      return c;
    });
    localStorage.setItem(`classes_${user.id}`, JSON.stringify(updatedClasses));
    setIsFinished(true);
  };

  function getStudentName(id) {
    if (!id || !classDetails || !classDetails.students) return '';
    const student = classDetails.students.find(s => s.id === id);
    return student ? student.name : 'Unknown';
  }

  return (
    <div className="class-details-container">
      <div className="class-details-header">
        <h1>{classDetails.name}</h1>
        <div className="class-actions">
          <button onClick={() => setModalOpen(true)} className="action-btn take-attendance-btn">
            Take Attendance
          </button>
        </div>
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

      <Modal isOpen={confirmModal.isOpen && confirmModal.title === 'Declare Holiday'} onClose={() => { setConfirmModal({ isOpen: false }); setHolidayName(''); }}>
        <div className="session-select-modal">
          <h2>Declare Holiday</h2>
          <p>Optionally enter a name for the holiday (e.g. Diwali, Christmas, etc):</p>
          <input
            type="text"
            value={holidayName}
            onChange={e => setHolidayName(e.target.value)}
            placeholder="Holiday Name (optional)"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #ccc', marginBottom: '18px', fontSize: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setConfirmModal({ isOpen: false }); setHolidayName(''); }} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#eee', color: '#333', fontWeight: 500 }}>Cancel</button>
            <button onClick={handleDeclareHoliday} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 600 }}>Declare Holiday</button>
          </div>
        </div>
      </Modal>

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

      <StudentStatsModal
        student={viewingStudentStats}
        classDetails={classDetails}
        onClose={() => setViewingStudentStats(null)}
      />

      <EditAttendanceModal
        record={editingAttendanceRecord}
        classDetails={classDetails}
        onSave={updatedRecord => {
          // Update attendance record in classDetails
          const updatedAttendance = (classDetails.attendance || []).map(r => r.id === updatedRecord.id ? updatedRecord : r);
          const updatedClass = { ...classDetails, attendance: updatedAttendance };
          setClassDetails(updatedClass);
          updateAndSaveClasses(updatedClass);
          setEditingAttendanceRecord(null);
        }}
        onClose={() => setEditingAttendanceRecord(null)}
      />

      <ConfirmationModal
        isOpen={!!deletingAttendanceRecord}
        onClose={() => setDeletingAttendanceRecord(null)}
        onConfirm={() => {
          // Delete attendance record
          const updatedAttendance = (classDetails.attendance || []).filter(r => r.id !== deletingAttendanceRecord.id);
          const updatedClass = { ...classDetails, attendance: updatedAttendance };
          setClassDetails(updatedClass);
          updateAndSaveClasses(updatedClass);
          setDeletingAttendanceRecord(null);
        }}
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
      />

      <div className="class-details-tabs">
        <button onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'active' : ''}>Students</button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>Attendance History</button>
        <button onClick={() => setActiveTab('timetable')} className={activeTab === 'timetable' ? 'active' : ''}>Timetable</button>
        <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>Calendar</button>
      </div>

      <div className="tab-content">
        {activeTab === 'students' && (
          <div className="students-container">
            {/* Cumulative stats section for all sessions */}
            <div className="live-stats-container" style={{marginBottom: 18}}>
              <h3>Session Types (All Time)</h3>
              <div className="stats-grid compact-stats-grid colored-stats-grid four-per-row">
                <div className="stat-card holidays" style={{ background: '#6b7280', color: '#fff' }}>
                  <h4>{cumulativeStats.holidays}</h4>
                  <p>Holidays</p>
                  <div style={{fontSize:'0.95em',opacity:0.8}}>{cumulativeStats.sessions ? ((cumulativeStats.holidays / cumulativeStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
                </div>
                <div className="stat-card fulldays" style={{ background: '#14b8a6', color: '#fff' }}>
                  <h4>{cumulativeStats.fullDays}</h4>
                  <p>Full Days</p>
                  <div style={{fontSize:'0.95em',opacity:0.8}}>{cumulativeStats.sessions ? ((cumulativeStats.fullDays / cumulativeStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
                </div>
                <div className="stat-card halfdays" style={{ background: '#fb923c', color: '#fff' }}>
                  <h4>{cumulativeStats.halfDays}</h4>
                  <p>Half Days</p>
                  <div style={{fontSize:'0.95em',opacity:0.8}}>{cumulativeStats.sessions ? ((cumulativeStats.halfDays / cumulativeStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
                </div>
                <div className="stat-card sessions" style={{ background: '#4f46e5', color: '#fff' }}>
                  <h4>{cumulativeStats.sessions}</h4>
                  <p>Total Sessions</p>
                  <div style={{fontSize:'0.95em',opacity:0.8}}>100%</div>
                </div>
              </div>
            </div>
            {liveStats && (
              <div className="live-stats-container">
                <h3>Today's Attendance</h3>
                <div className="stats-grid">
                  <div className="stat-card present" style={{ cursor: 'pointer' }} onClick={() => {
                    const presentStudents = (todaysAttendance?.students || []).filter(s => s.status === 'present');
                    setStudentListModal({ isOpen: true, title: 'Present Students', students: presentStudents });
                  }}>
                    <h4>{liveStats.present.count}</h4>
                    <p>Present ({liveStats.present.percent}%)</p>
                  </div>
                  <div className="stat-card absent" style={{ cursor: 'pointer' }} onClick={() => {
                    const absentStudents = (todaysAttendance?.students || []).filter(s => s.status === 'absent');
                    setStudentListModal({ isOpen: true, title: 'Absent Students', students: absentStudents });
                  }}>
                    <h4>{liveStats.absent.count}</h4>
                    <p>Absent ({liveStats.absent.percent}%)</p>
                  </div>
                  <div className="stat-card late" style={{ cursor: 'pointer' }} onClick={() => {
                    const lateStudents = (todaysAttendance?.students || []).filter(s => s.status === 'late');
                    setStudentListModal({ isOpen: true, title: 'Late Students', students: lateStudents });
                  }}>
                    <h4>{liveStats.late.count}</h4>
                    <p>Late ({liveStats.late.percent}%)</p>
                  </div>
                </div>
              </div>
            )}
            <div className="student-list-actions">
              <div className="student-list-container">
                <div className="student-list-header">
                  <h2>Student List</h2>
                  <button onClick={() => { setEditingStudent(null); setStudentModalOpen(true); }} className="add-student-main-btn">
                    <i className='bx bx-user-plus'></i> Add Student
                  </button>
                </div>
                <div className="student-list-table-wrapper">
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
                              <button onClick={() => setViewingStudentStats(student)} className="action-btn stats">
                                <i className='bx bx-bar-chart'></i>
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-container">
            <div className="history-search-bar-wrapper">
              <input 
                type="text" 
                placeholder="Search by date (YYYY-MM-DD)" 
                className="history-search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className='bx bx-search search-icon'></i>
            </div>
            <div className="attendance-history-table-wrapper">
              <table className="attendance-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Session Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(record => {
                    const present = (record.students || []).filter(s => s.status === 'present');
                    const absent = (record.students || []).filter(s => s.status === 'absent');
                    const late = (record.students || []).filter(s => s.status === 'late');
                    return (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString('en-CA')}</td>
                        <td>{record.type}</td>
                        <td>
                          <button className="history-action-btn view" onClick={() => setStudentListModal({ isOpen: true, title: `Attendance Summary (${present.length} Present, ${absent.length} Absent, ${late.length} Late)`, students: { present, absent, late } })}>
                            <i className='bx bx-show'></i> View
                          </button>
                          <button className="history-action-btn edit" onClick={() => setEditingAttendanceRecord(record)}>
                            <i className='bx bx-edit'></i> Edit
                          </button>
                          <button className="history-action-btn delete" onClick={() => setDeletingAttendanceRecord(record)}>
                            <i className='bx bx-trash'></i> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="timetable-section">
            <div className="timetable-actions">
              <button onClick={() => isTimetableEditing ? handleCancelTimetableEdit() : setIsTimetableEditing(true)} className="action-btn edit-timetable-main-btn">
                <i className={`bx ${isTimetableEditing ? 'bx-x' : 'bxs-edit'}`}></i>
                {isTimetableEditing ? 'Cancel' : 'Edit Timetable'}
              </button>
              {isTimetableEditing && (
                <button onClick={handleSaveTimetable} className="action-btn save-timetable-btn">
                  <i className='bx bx-save'></i>
                  Save Timetable
                </button>
              )}
            </div>
            
            <div className="timetable-day-tabs">
              {classDetails.timetable && Object.keys(classDetails.timetable).map(day => {
                const attendance = classDetails.attendance || [];
                const weekdayIndex = [
                  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
                ].indexOf(day);
                
                const record = attendance
                  .filter(r => {
                    const d = new Date(r.date);
                    if (isNaN(d.getTime())) return false; 
                    return d.getDay() === weekdayIndex;
                  })
                  .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                const sessionType = record ? record.type : 'Not Set';

                return (
                  <button 
                    key={day}
                    className={`day-tab ${activeTimetableDay === day ? 'active' : ''}`}
                    onClick={() => setActiveTimetableDay(day)}
                  >
                    <div>{day}</div>
                  </button>
                );
              })}
            </div>

            {!isTimetableEditing ? (
              <>
                <div className="timetable-view-container">
                  {classDetails.timetable && classDetails.timetable[activeTimetableDay] && classDetails.timetable[activeTimetableDay].length > 0 ? (
                    <table className="timetable-view-table">
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Subject</th>
                          <th>Teacher</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classDetails.timetable[activeTimetableDay].map((p, index) => (
                          <tr key={index}>
                            <td>{p.period}</td>
                            <td>{p.subject || '-'}</td>
                            <td>{p.teacher || '-'}</td>
                            <td>{p.time || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-timetable-message">
                      <i className='bx bx-calendar-exclamation'></i>
                      <p>No timetable set for {activeTimetableDay}.</p>
                      <span>Click 'Edit Timetable' to get started.</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="timetable-editor">
                <div className="timetable-day-content">
                  <TimetableDayEditor 
                    day={activeTimetableDay}
                    periods={classDetails.timetable && classDetails.timetable[activeTimetableDay] ? classDetails.timetable[activeTimetableDay] : []}
                    onUpdate={handleTimetableUpdate}
                    onAddPeriod={handleAddPeriod}
                    onRemovePeriod={handleRemovePeriod}
                  />
                </div>
              </div>
            )}
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

      <InfoModal
        isOpen={studentListModal.isOpen}
        onClose={() => setStudentListModal({ ...studentListModal, isOpen: false })}
        title={studentListModal.title}
      >
        <div className="attendance-history-modal-popup">
        {studentListModal.statType === 'sessions-breakdown' ? (
          <div className="vertical-breakdown" style={{margin:'0 0 10px 0'}}>
            <div className="stat-card holidays" style={{ background: '#6b7280', color: '#fff' }}>
              <h4>{studentListModal.sessionStats.holidays}</h4>
              <p>Holidays</p>
              <div style={{fontSize:'0.95em',opacity:0.8}}>{studentListModal.sessionStats.sessions ? ((studentListModal.sessionStats.holidays / studentListModal.sessionStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
            </div>
            <div className="stat-card fulldays" style={{ background: '#14b8a6', color: '#fff' }}>
              <h4>{studentListModal.sessionStats.fullDays}</h4>
              <p>Full Days</p>
              <div style={{fontSize:'0.95em',opacity:0.8}}>{studentListModal.sessionStats.sessions ? ((studentListModal.sessionStats.fullDays / studentListModal.sessionStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
            </div>
            <div className="stat-card halfdays" style={{ background: '#fb923c', color: '#fff' }}>
              <h4>{studentListModal.sessionStats.halfDays}</h4>
              <p>Half Days</p>
              <div style={{fontSize:'0.95em',opacity:0.8}}>{studentListModal.sessionStats.sessions ? ((studentListModal.sessionStats.halfDays / studentListModal.sessionStats.sessions) * 100).toFixed(1) : '0.0'}%</div>
            </div>
            <div className="stat-card sessions" style={{ background: '#4f46e5', color: '#fff' }}>
              <h4>{studentListModal.sessionStats.sessions}</h4>
              <p>Total Sessions</p>
              <div style={{fontSize:'0.95em',opacity:0.8}}>100%</div>
            </div>
          </div>
        ) : Array.isArray(studentListModal.students) && studentListModal.statType ? (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {studentListModal.students.map((s, i) => (
              <li key={s.id || i} style={{ padding: '6px 0', borderBottom: '1px solid #eee', display:'flex',justifyContent:'space-between' }}>
                <span>{s.name} {s.regNo ? <span style={{ color: '#888', fontSize: '0.95em' }}>({s.regNo})</span> : null}</span>
                <span style={{fontWeight:600}}>{s.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          studentListModal.students && Array.isArray(studentListModal.students.present) ? (
            <div className="attendance-history-modal-lists">
              <div className="attendance-history-modal-list present">
                <h4>Present ({studentListModal.students.present.length})</h4>
                <ul>
                  {studentListModal.students.present.length === 0 ? <li className="none">None</li> : studentListModal.students.present.map((s, i) => (
                    <li key={s.id || i}>{getStudentName(s.id)}</li>
                  ))}
                </ul>
              </div>
              <div className="attendance-history-modal-list absent">
                <h4>Absent ({studentListModal.students.absent.length})</h4>
                <ul>
                  {studentListModal.students.absent.length === 0 ? <li className="none">None</li> : studentListModal.students.absent.map((s, i) => (
                    <li key={s.id || i}>{getStudentName(s.id)}</li>
                  ))}
                </ul>
              </div>
              <div className="attendance-history-modal-list late">
                <h4>Late ({studentListModal.students.late.length})</h4>
                <ul>
                  {studentListModal.students.late.length === 0 ? <li className="none">None</li> : studentListModal.students.late.map((s, i) => (
                    <li key={s.id || i}>{getStudentName(s.id)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null
        )}
        </div>
      </InfoModal>
    </div>
  );
};

export default ClassDetailsPage;
