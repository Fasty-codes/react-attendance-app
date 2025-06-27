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
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import TodosPage from './pages/TodosPage';
import TimetablePage from './pages/TimetablePage';

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
                <Route path="/class/:classId/timetable" element={<TimetablePage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/students" element={<StudentManagementPage />} />
                <Route path="/todos" element={<TodosPage />} />
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