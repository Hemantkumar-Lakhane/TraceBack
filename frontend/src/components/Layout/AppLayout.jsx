import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const isDesktop = window.innerWidth > 1024;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-color)',
      overflowX: 'hidden'
    }}>
      <Navbar onToggleSidebar={toggleSidebar} />

      <div style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        width: '100%'
      }}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => {
            if (window.innerWidth <= 1024) setSidebarOpen(false);
          }}
        />

        {/* Content Wrapper perfectly balanced without right-shift */}
        <div style={{
          flex: 1,
          marginLeft: sidebarOpen && isDesktop ? '260px' : '0',
          width: sidebarOpen && isDesktop ? 'calc(100% - 260px)' : '100%',
          transition: 'margin-left 0.25s cubic-bezier(0.16, 1, 0.3, 1), width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          <main style={{
            width: '100%',
            maxWidth: '1240px',
            padding: '2rem 2.5rem 3.5rem',
            boxSizing: 'border-box'
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
