import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ClassDetailsPage from './pages/ClassDetailsPage';
import AttendancePage from './pages/AttendancePage';
import StudentManagementPage from './pages/StudentManagementPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme}>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
        
        <Route path="/*" element={
          user ? (
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/class/:classId" element={<ClassDetailsPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/students" element={<StudentManagementPage />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }/>
      </Routes>
    </div>
  );
};

export default AppRoutes; 