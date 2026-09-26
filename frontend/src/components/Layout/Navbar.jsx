import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Menu, User, LogOut, Shield, Settings, CheckCheck, ExternalLink } from 'lucide-react';
import notificationService from '../../api/notificationService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
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

  return (
    <header className="surface-glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '68px',
      borderBottom: '1px solid var(--slate-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      gap: '1rem'
    }}>
      {/* Left section: Hamburger (mobile) + Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: 'var(--slate-700)',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
          }}>
            TB
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--slate-900)',
            letterSpacing: '-0.02em'
          }}>
            Trace<span style={{ color: 'var(--primary)' }}>Back</span>
          </span>
        </Link>
      </div>

      {/* Middle: Global Campus Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--slate-400)'
          }}
        />
        <input
          type="text"
          placeholder="Search lost or found items (e.g. MacBook, Wallet, Keys, Hall B)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 1rem 0.5rem 2.25rem',
            backgroundColor: 'var(--slate-100)',
            border: '1px solid var(--slate-200)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.borderColor = 'var(--primary)';
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = 'var(--slate-100)';
            e.target.style.borderColor = 'var(--slate-200)';
          }}
        />
      </form>

      {/* Right Controls: Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            style={{
              background: showNotifDropdown ? 'var(--slate-100)' : 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slate-700)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--rose)',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }} />
            )}
          </button>

          {showNotifDropdown && (
            <div className="surface-card animate-fade-in" style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              width: '340px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--slate-100)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                    No notifications right now
                  </div>
                ) : (
                  notifications.map(n => (
                    <Link
                      key={n.id}
                      to={n.link || '/notifications'}
                      onClick={() => setShowNotifDropdown(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        borderBottom: '1px solid var(--slate-100)',
                        backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: n.read ? 600 : 700, color: 'var(--slate-900)' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <div style={{ padding: '8px 16px', background: 'var(--slate-50)', textAlign: 'center', borderTop: '1px solid var(--slate-100)' }}>
                <Link to="/notifications" onClick={() => setShowNotifDropdown(false)} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  View All Notifications →
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
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "User"}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--slate-200)'
              }}
            />
            <div style={{ textAlign: 'left', display: 'none', sm: 'block' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600 }}>
                {user?.role || "STUDENT"}
              </div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="surface-card animate-fade-in" style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              width: '220px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>{user?.email}</p>
                <span className="badge badge-open" style={{ marginTop: '6px' }}>{user?.role}</span>
              </div>

              <div style={{ padding: '6px' }}>
                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '0.8125rem',
                    color: 'var(--slate-700)',
                    borderRadius: '6px'
                  }}
                  className="btn-ghost"
                >
                  <User size={16} /> My Profile
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
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '0.8125rem',
                    color: 'var(--rose-dark)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} /> Logout
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
