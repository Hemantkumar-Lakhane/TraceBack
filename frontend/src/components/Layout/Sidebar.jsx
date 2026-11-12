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
  HelpCircle,
  Building2,
  Radio
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const getNavLinks = () => {
    if (role === 'SECURITY') {
      return [
        { to: '/security', label: 'Security Dashboard', icon: <LayoutDashboard size={17} /> },
        { to: '/security/claims', label: 'Pending Verifications', icon: <ShieldCheck size={17} />, badge: '1 Action' },
        { to: '/security/report/found', label: 'Log Handed-Over Item', icon: <PlusCircle size={17} /> },
        { to: '/security/inventory', label: 'Locker Vault Custody', icon: <Archive size={17} /> },
        { to: '/browse', label: 'Search Campus Database', icon: <Search size={17} /> },
        { to: '/notifications', label: 'Duty Logs & Alerts', icon: <Bell size={17} /> },
        { to: '/profile', label: 'Officer Profile', icon: <User size={17} /> }
      ];
    }

    if (role === 'ADMIN') {
      return [
        { to: '/admin', label: 'Platform Overview', icon: <LayoutDashboard size={17} /> },
        { to: '/admin/users', label: 'User Directory & Roles', icon: <Users size={17} /> },
        { to: '/admin/moderation', label: 'Moderation Queue', icon: <ShieldAlert size={17} />, badge: '1 Flag' },
        { to: '/admin/analytics', label: 'Recovery Metrics & KPIs', icon: <BarChart3 size={17} /> },
        { to: '/browse', label: 'All Campus Reports', icon: <Search size={17} /> },
        { to: '/profile', label: 'Admin Configuration', icon: <User size={17} /> }
      ];
    }

    // Default: STUDENT links
    return [
      { to: '/dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={17} /> },
      { to: '/browse', label: 'Browse Lost & Found', icon: <Search size={17} /> },
      { to: '/report/lost', label: 'Report Lost Item', icon: <PlusCircle size={17} /> },
      { to: '/report/found', label: 'Report Found Item', icon: <PlusCircle size={17} /> },
      { to: '/matches', label: 'Matched Items', icon: <GitMerge size={17} /> },
      { to: '/chat', label: 'Verification Chat', icon: <MessageSquare size={17} /> },
      { to: '/claims', label: 'My Claims & Passes', icon: <FileCheck2 size={17} /> },
      { to: '/notifications', label: 'Alerts & Messages', icon: <Bell size={17} /> },
      { to: '/profile', label: 'Student Profile', icon: <User size={17} /> }
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
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
            display: window.innerWidth <= 1024 ? 'block' : 'none'
          }}
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '56px',
        bottom: 0,
        left: 0,
        zIndex: 95,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease',
        boxShadow: '1px 0 3px rgba(0, 0, 0, 0.02)',
        overflowY: 'auto'
      }}>
        {/* Navigation list */}
        <div style={{ padding: '1.25rem 0.875rem' }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--slate-400)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0 0.75rem',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{role === 'ADMIN' ? 'Administration' : role === 'SECURITY' ? 'Campus Police' : 'Student Portal'}</span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block'
            }} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-main)' : 'var(--slate-500)',
                  backgroundColor: isActive ? 'var(--slate-100)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isActive ? '#2563eb' : 'var(--slate-400)', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--slate-200)',
                    color: 'var(--slate-700)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Desk Information Box */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--slate-50)' }}>
          <div style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '3px' }}>
              <Building2 size={13} color="#2563eb" />
              <span>Ramanujan Security Vault</span>
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
              Ground Floor, Student Activity Center<br />
              Helpline: <strong>+91 (022) 2576-7000</strong>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
