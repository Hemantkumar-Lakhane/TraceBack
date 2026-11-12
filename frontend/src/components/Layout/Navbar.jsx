import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Bell, Menu, User, LogOut, Shield, Award, UserCheck, Sun, Moon } from 'lucide-react';
import notificationService from '../../api/notificationService';
import TraceBackLogo from '../TraceBackLogo';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, loginAs } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const loadNotifs = async () => {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    };
    loadNotifs();

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMarkAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleSwitchRole = (role) => {
    loginAs(role);
    setShowUserDropdown(false);
    if (role === 'SECURITY') navigate('/security');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '56px',
      backgroundColor: 'var(--navbar-bg)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      gap: '1rem',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      {/* Left section: Hamburger (mobile) + Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--slate-600)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px'
          }}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <TraceBackLogo size={28} showWordmark={true} />
        </Link>
      </div>

      {/* Middle: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--slate-400)'
          }}
        />
        <input
          type="text"
          placeholder="Search items, locations, reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.4rem 0.75rem 0.4rem 2rem',
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            outline: 'none',
            color: 'var(--text-main)',
            transition: 'background-color 0.2s ease, border-color 0.2s ease'
          }}
        />
      </form>

      {/* Right Controls: Theme Toggle, Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
            transition: 'all 0.15s ease'
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="var(--slate-600)" />}
        </button>
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            style={{
              background: showNotifDropdown ? 'var(--slate-100)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-600)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--rose)',
                borderRadius: '50%',
                border: '1.5px solid #ffffff'
              }} />
            )}
          </button>

          {showNotifDropdown && (
            <div className="surface-card animate-fade-in" style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '320px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-900)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.8125rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <Link
                      key={n.id}
                      to={n.link || '/notifications'}
                      onClick={() => setShowNotifDropdown(false)}
                      style={{
                        display: 'block',
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--slate-100)',
                        backgroundColor: n.read ? 'transparent' : 'var(--slate-50)',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: n.read ? 500 : 600, color: 'var(--slate-900)' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '3px' }}>
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div style={{ padding: '8px 14px', background: 'var(--slate-50)', textAlign: 'center', borderTop: '1px solid var(--slate-100)' }}>
                <Link to="/notifications" onClick={() => setShowNotifDropdown(false)} style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--slate-700)' }}>
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{
              background: 'transparent',
              border: '1px solid var(--slate-200)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 8px 3px 4px',
              borderRadius: '6px'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '4px',
              backgroundColor: 'var(--slate-100)',
              color: 'var(--slate-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-900)', lineHeight: 1.1 }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 500 }}>
                {user?.role || "STUDENT"}
              </div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="surface-card animate-fade-in" style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '240px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>{user?.email}</p>
                <span className="badge badge-open" style={{ marginTop: '6px' }}>{user?.role}</span>
              </div>

              {/* Role Switcher in User Menu */}
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--slate-100)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--slate-400)', marginBottom: '4px' }}>
                  SWITCH ACCOUNT VIEW:
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleSwitchRole('STUDENT')}
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'STUDENT' ? '#2563eb' : 'var(--card-bg)',
                      color: user?.role === 'STUDENT' ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => handleSwitchRole('SECURITY')}
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'SECURITY' ? '#059669' : 'var(--card-bg)',
                      color: user?.role === 'SECURITY' ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Security
                  </button>
                  <button
                    onClick={() => handleSwitchRole('ADMIN')}
                    style={{
                      flex: 1,
                      padding: '4px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'ADMIN' ? '#7c3aed' : 'var(--card-bg)',
                      color: user?.role === 'ADMIN' ? '#ffffff' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div style={{ padding: '4px' }}>
                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--slate-700)',
                    borderRadius: '4px',
                    textDecoration: 'none'
                  }}
                  className="btn-ghost"
                >
                  <User size={15} /> Account Settings
                </Link>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    color: 'var(--rose)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    textAlign: 'left'
                  }}
                  className="btn-ghost"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
