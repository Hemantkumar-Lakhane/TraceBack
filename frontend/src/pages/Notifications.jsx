import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, GitMerge, MessageSquare, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';
import notificationService from '../api/notificationService';
import { useToast } from '../context/ToastContext';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
    toast.success("All notifications marked as read");
  };

  const handleItemClick = async (notif) => {
    await notificationService.markAsRead(notif.id);
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'MATCH': return <GitMerge size={16} color="var(--slate-700)" />;
      case 'CHAT': return <MessageSquare size={16} color="var(--slate-700)" />;
      case 'CLAIM': return <ShieldCheck size={16} color="var(--slate-700)" />;
      default: return <Bell size={16} color="var(--slate-500)" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Notification Center
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Real-time updates on matches, chat inquiries, and security claim approvals
          </p>
        </div>

        <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['ALL', 'MATCH', 'CHAT', 'CLAIM'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--primary)' : '#ffffff',
              color: filter === f ? '#ffffff' : 'var(--slate-700)',
              border: '1px solid var(--slate-200)',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {f === 'ALL' ? 'All Alerts' : f === 'MATCH' ? 'Matches' : f === 'CHAT' ? 'Messages' : 'Claims'}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="surface-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            <Bell size={40} style={{ margin: '0 auto 8px', color: 'var(--slate-300)' }} />
            <p>No notifications in this category</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredNotifs.map(n => (
              <Link
                key={n.id}
                to={n.link || '#'}
                onClick={() => handleItemClick(n)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--slate-100)',
                  backgroundColor: n.read ? 'transparent' : 'var(--primary-light)',
                  textDecoration: 'none',
                  gap: '1rem',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: n.read ? 600 : 700, color: 'var(--slate-900)' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                      {new Date(n.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!n.read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '50%'
                    }} />
                  )}
                  <ArrowRight size={16} color="var(--slate-400)" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
