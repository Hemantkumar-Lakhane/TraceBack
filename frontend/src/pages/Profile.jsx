import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, ShieldCheck, Phone, BookOpen, Award, Building, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            User Profile & Credentials
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Verified campus identity for TraceBack Lost & Found network
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--rose-dark)', gap: '6px' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="surface-card" style={{ padding: '2rem', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "Avatar"}
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {user?.name || "Alex Johnson"}
              </h2>
              <span className="badge badge-open">{user?.role || "STUDENT"}</span>
            </div>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '2px' }}>
              {user?.email || "alex.student@campus.edu"}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--emerald-dark)', marginTop: '6px', fontWeight: 600 }}>
              <CheckCircle2 size={14} /> Verified Campus Account
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
              STUDENT / BADGE ID
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {user?.studentId || user?.badgeNumber || 'STU-89241'}
            </div>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
              DEPARTMENT / STATION
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {user?.department || user?.station || 'Computer Science & Engineering'}
            </div>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
              CONTACT PHONE
            </span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {user?.phone || '+1 (555) 234-5678'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
