import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  GitMerge,
  MessageSquare,
  FileCheck2,
  Bell,
  User,
  ShieldAlert,
  ShieldCheck,
  Archive,
  Users,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const getNavLinks = () => {
    if (role === 'SECURITY') {
      return [
        { to: '/security', label: 'Security Dashboard', icon: <LayoutDashboard size={16} /> },
        { to: '/security/claims', label: 'Pending Claims', icon: <ShieldCheck size={16} />, badge: '1' },
        { to: '/security/report/found', label: 'Log Turned-In Item', icon: <PlusCircle size={16} /> },
        { to: '/security/inventory', label: 'Custody Inventory', icon: <Archive size={16} /> },
        { to: '/browse', label: 'Search All Reports', icon: <Search size={16} /> },
        { to: '/notifications', label: 'Alerts & Logs', icon: <Bell size={16} /> },
        { to: '/profile', label: 'Officer Profile', icon: <User size={16} /> }
      ];
    }

    if (role === 'ADMIN') {
      return [
        { to: '/admin', label: 'Platform Overview', icon: <LayoutDashboard size={16} /> },
        { to: '/admin/users', label: 'User Management', icon: <Users size={16} /> },
        { to: '/admin/moderation', label: 'Moderation Queue', icon: <ShieldAlert size={16} />, badge: '1' },
        { to: '/admin/analytics', label: 'Analytics & KPIs', icon: <BarChart3 size={16} /> },
        { to: '/browse', label: 'Campus Database', icon: <Search size={16} /> },
        { to: '/profile', label: 'Admin Settings', icon: <User size={16} /> }
      ];
    }

    // Default: STUDENT links
    return [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
      { to: '/browse', label: 'Browse Reports', icon: <Search size={16} /> },
      { to: '/report/lost', label: 'Report Lost Item', icon: <PlusCircle size={16} /> },
      { to: '/report/found', label: 'Report Found Item', icon: <PlusCircle size={16} /> },
      { to: '/matches', label: 'Matched Items', icon: <GitMerge size={16} /> },
      { to: '/chat', label: 'Verification Chat', icon: <MessageSquare size={16} /> },
      { to: '/claims', label: 'Claims & Handover', icon: <FileCheck2 size={16} /> },
      { to: '/notifications', label: 'Notifications', icon: <Bell size={16} /> },
      { to: '/profile', label: 'Account Profile', icon: <User size={16} /> }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      <aside style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--slate-200)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '56px',
        bottom: 0,
        left: 0,
        zIndex: 95,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease',
        overflowY: 'auto'
      }}>
        {/* Navigation list */}
        <div style={{ padding: '1rem 0.75rem' }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--slate-400)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '0 0.5rem',
            marginBottom: '0.5rem'
          }}>
            {role === 'ADMIN' ? 'Administration' : role === 'SECURITY' ? 'Security Operations' : 'Student Portal'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--slate-900)' : 'var(--slate-600)',
                  backgroundColor: isActive ? 'var(--slate-100)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--slate-200)',
                    color: 'var(--slate-800)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom desk callout */}
        <div style={{ padding: '0.875rem', borderTop: '1px solid var(--slate-100)', backgroundColor: 'var(--slate-50)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
            <div style={{ fontWeight: 600, color: 'var(--slate-800)', marginBottom: '2px' }}>
              Campus Security Desk
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
              Main Desk: Student Union Hall<br />
              Direct Line: (555) 019-8800
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
