import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { getModerationQueue, deleteReportByAdmin } from '../api/adminService';
import { useToast } from '../context/ToastContext';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const AdminModeration = () => {
  const [queue, setQueue] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const { toast } = useToast();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getModerationQueue();
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching moderation queue:', err);
      toast.error('Could not load moderation queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Permanently remove report #${item.reportId} ("${item.title}")? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteReportByAdmin(item.reportId, item.type || 'LOST');
      setQueue(prev => prev.filter(q => q.id !== item.id));
      toast.success(`Report #${item.reportId} permanently removed for policy compliance.`);
    } catch (err) {
      toast.error('Failed to remove report.');
    }
  };

  const handleDismiss = (item) => {
    setQueue(prev => prev.filter(q => q.id !== item.id));
    toast.info(`Flag for report #${item.reportId} dismissed as compliant.`);
  };

  const safeQueue = Array.isArray(queue) ? queue : [];
  const filtered = safeQueue.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">Content Governance</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {CAMPUS_CONFIG.name} Security & Compliance
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Report Moderation & Security Queue
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Review flagged submissions, remove inappropriate listings, and enforce campus safety standards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={fetchQueue} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <RefreshCw size={14} /> Refresh Queue
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Flagged Items
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: safeQueue.length > 0 ? 'var(--rose)' : 'var(--text-main)', marginTop: '2px' }}>
            {safeQueue.length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Require admin review</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Automated Keyword Alerts
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent, #2563eb)', marginTop: '2px' }}>
            {safeQueue.filter(q => q.reason?.toLowerCase().includes('keyword') || q.reason?.toLowerCase().includes('scanner')).length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Scanned at report time</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Queue Status
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: safeQueue.length === 0 ? 'var(--emerald)' : 'var(--text-main)', marginTop: '2px' }}>
            {safeQueue.length === 0 ? 'CLEAN' : 'ACTION REQUIRED'}
          </div>
          <span style={{ fontSize: '0.6875rem', color: safeQueue.length === 0 ? 'var(--emerald)' : 'var(--rose)' }}>
            {safeQueue.length === 0 ? 'Zero pending violations' : `${safeQueue.length} report(s) need inspection`}
          </span>
        </div>
      </div>

      {/* Moderation List */}
      {loading ? (
        <div className="surface-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)', borderRadius: '8px' }}>
          Loading moderation queue...
        </div>
      ) : safeQueue.length === 0 ? (
        <div className="surface-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '8px' }}>
          <CheckCircle2 size={42} color="var(--emerald)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Campus Moderation Queue is Clear
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem', maxWidth: '420px', margin: '0 auto' }}>
            No campus lost or found reports currently violate institutional policies or spam guidelines.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(item => (
            <div
              key={item.id}
              className="surface-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '8px',
                borderLeft: '4px solid var(--rose)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  backgroundColor: '#fef2f2',
                  color: 'var(--rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldAlert size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-rejected" style={{ fontSize: '0.625rem' }}>
                      POLICY FLAG
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--slate-500)' }}>
                      Report #{item.reportId} ({item.type || 'LOST'})
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {item.title}
                  </h4>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '4px', lineHeight: '1.4' }}>
                    Flag Reason: <strong style={{ color: 'var(--text-main)' }}>{item.reason}</strong>
                  </p>

                  <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                    Flagged by {item.flaggedBy} • {item.dateFlagged ? new Date(item.dateFlagged).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                  to={`/reports/${(item.type || 'LOST').toLowerCase()}/${item.reportId}`}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', gap: '4px' }}
                >
                  <Eye size={13} /> Inspect Report
                </Link>

                <button
                  onClick={() => handleDismiss(item)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Dismiss Flag
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.75rem', gap: '4px' }}
                >
                  <Trash2 size={13} /> Permanently Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminModeration;
