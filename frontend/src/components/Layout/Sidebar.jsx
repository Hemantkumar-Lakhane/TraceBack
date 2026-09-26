import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Sparkles,
  MessageSquare,
  FileCheck2,
  Bell,
  User,
  ShieldAlert,
  ShieldCheck,
  Archive,
  Users,
  BarChart3,
  Flame,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const getNavLinks = () => {
    if (role === 'SECURITY') {
      return [
        { to: '/security', label: 'Security Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/security/claims', label: 'Pending Verifications', icon: <ShieldCheck size={18} />, badge: '1 Action' },
        { to: '/security/report/found', label: 'Log Handed-Over Item', icon: <PlusCircle size={18} /> },
        { to: '/security/inventory', label: 'Vault Custody Inventory', icon: <Archive size={18} /> },
        { to: '/browse', label: 'Search All Reports', icon: <Search size={18} /> },
        { to: '/notifications', label: 'Alerts & Logs', icon: <Bell size={18} /> },
        { to: '/profile', label: 'Security Badge Profile', icon: <User size={18} /> }
      ];
    }

    if (role === 'ADMIN') {
      return [
        { to: '/admin', label: 'Platform Overview', icon: <LayoutDashboard size={18} /> },
        { to: '/admin/users', label: 'User Directory & Roles', icon: <Users size={18} /> },
        { to: '/admin/moderation', label: 'Moderation Queue', icon: <ShieldAlert size={18} />, badge: '1 Flag' },
        { to: '/admin/analytics', label: 'Campus Insights & KPIs', icon: <BarChart3 size={18} /> },
        { to: '/browse', label: 'Browse Campus Database', icon: <Search size={18} /> },
        { to: '/profile', label: 'Admin Settings', icon: <User size={18} /> }
      ];
    }

    // Default: STUDENT links
    return [
      { to: '/dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={18} /> },
      { to: '/browse', label: 'Browse Lost & Found', icon: <Search size={18} /> },
      { to: '/report/lost', label: 'Report Lost Item', icon: <PlusCircle size={18} /> },
      { to: '/report/found', label: 'Report Found Item', icon: <PlusCircle size={18} /> },
      { to: '/matches', label: 'My Matches', icon: <Sparkles size={18} />, badge: '92% Match' },
      { to: '/chat', label: 'Verification Chat', icon: <MessageSquare size={18} /> },
      { to: '/claims', label: 'My Claims & Passes', icon: <FileCheck2 size={18} /> },
      { to: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
      { to: '/profile', label: 'Student Profile', icon: <User size={18} /> }
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
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--slate-200)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: '68px',
        bottom: 0,
        left: 0,
        zIndex: 95,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto'
      }}>
        {/* Navigation list */}
        <div style={{ padding: '1.25rem 0.875rem' }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: 'var(--slate-400)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0 0.75rem',
            marginBottom: '0.625rem'
          }}>
            {role} PORTAL
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--slate-700)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Safety & Support Callout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--slate-200)',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '4px' }}>
              <ShieldCheck size={14} color="var(--emerald)" />
              Campus Security Desk
            </div>
            <p style={{ color: 'var(--slate-500)', lineHeight: 1.4 }}>
              Vault Desk: Student Union Hall. Hotline: (555) 998-0012.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
