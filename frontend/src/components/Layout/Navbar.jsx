import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Menu, User, LogOut, Shield, Award, UserCheck } from 'lucide-react';
import notificationService from '../../api/notificationService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, loginAs } = useAuth();
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
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--slate-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      gap: '1rem'
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

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            TB
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: '1.0625rem',
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            TraceBack
          </span>
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
            backgroundColor: '#ffffff',
            border: '1px solid var(--slate-300)',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            outline: 'none',
            color: 'var(--slate-900)'
          }}
        />
      </form>

      {/* Right Controls: Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid var(--slate-100)',
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
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--slate-100)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)' }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>{user?.email}</p>
                <span className="badge badge-open" style={{ marginTop: '6px' }}>{user?.role}</span>
              </div>

              {/* Role Switcher in User Menu */}
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--slate-100)', backgroundColor: 'var(--slate-50)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px' }}>
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
                      border: '1px solid var(--slate-200)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'STUDENT' ? '#0f172a' : '#ffffff',
                      color: user?.role === 'STUDENT' ? '#ffffff' : 'var(--slate-700)',
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
                      border: '1px solid var(--slate-200)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'SECURITY' ? '#0f172a' : '#ffffff',
                      color: user?.role === 'SECURITY' ? '#ffffff' : 'var(--slate-700)',
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
                      border: '1px solid var(--slate-200)',
                      borderRadius: '4px',
                      backgroundColor: user?.role === 'ADMIN' ? '#0f172a' : '#ffffff',
                      color: user?.role === 'ADMIN' ? '#ffffff' : 'var(--slate-700)',
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
