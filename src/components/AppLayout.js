import React, { useState, createContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppLayout.css';

export const SidebarContext = createContext();

const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, setSidebarCollapsed, toggleSidebar }}>
      <div className="app-layout">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`main-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout; 