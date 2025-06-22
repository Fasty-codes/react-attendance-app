import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout; 