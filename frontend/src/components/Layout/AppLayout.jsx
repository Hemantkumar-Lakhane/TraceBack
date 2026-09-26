import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import DemoRoleBanner from '../DemoRoleBanner';

export const AppLayout = () => {
  // On desktop, keep sidebar open by default; on mobile, toggle
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
      <DemoRoleBanner />
      <Navbar onToggleSidebar={toggleSidebar} />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => {
          if (window.innerWidth <= 1024) setSidebarOpen(false);
        }} />

        <main style={{
          flex: 1,
          marginLeft: sidebarOpen && window.innerWidth > 1024 ? '260px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: '1.75rem',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
