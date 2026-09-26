import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, CheckCircle2, AlertTriangle, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { getModerationQueue, deleteReportByAdmin } from '../api/adminService';
import { useToast } from '../context/ToastContext';

export const AdminModeration = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const data = await getModerationQueue();
        setQueue(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleDelete = async (item) => {
    await deleteReportByAdmin(item.reportId);
    setQueue(prev => prev.filter(q => q.id !== item.id));
    toast.success(`Report #${item.reportId} permanently removed for policy violation.`);
  };

  const handleDismiss = (item) => {
    setQueue(prev => prev.filter(q => q.id !== item.id));
    toast.info(`Flag for report #${item.reportId} dismissed.`);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Report Moderation Queue
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Review flagged spam submissions, inappropriate content, and duplicate posts
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading moderation queue...</div>
      ) : queue.length === 0 ? (
        <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px' }}>
          <CheckCircle2 size={48} color="var(--emerald)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            Moderation Queue is Clean!
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            No campus reports are currently flagged for policy violations.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {queue.map(item => (
            <div
              key={item.id}
              className="surface-card"
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                borderLeft: '4px solid var(--rose)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  color: 'var(--rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldAlert size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-rejected">FLAGGED CONTENT</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Report #{item.reportId}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                    Reason: <strong>{item.reason}</strong>
                  </p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                    Flagged by {item.flaggedBy} • {new Date(item.dateFlagged).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDismiss(item)} className="btn btn-secondary btn-sm">
                  Dismiss Flag
                </button>
                <button onClick={() => handleDelete(item)} className="btn btn-danger btn-sm" style={{ gap: '6px' }}>
                  <Trash2 size={14} /> Remove / Delete Report
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
