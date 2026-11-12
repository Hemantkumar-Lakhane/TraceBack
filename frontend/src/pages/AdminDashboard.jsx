import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Users,
  ShieldAlert,
  GitMerge,
  TrendingUp,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getAdminStats } from '../api/adminService';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--slate-200)',
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">Administration</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Administrator: {user?.name || 'Dean Sarah'}</span>
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            System Platform Overview
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            High-level metrics, user directory controls, and campus recovery analytics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/users" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Users size={14} /> Manage Users
          </Link>
          <Link to="/admin/moderation" className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
            <ShieldAlert size={14} /> Moderation Queue
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>REGISTERED USERS</span>
            <Users size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {stats?.totalUsers || 1482}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--emerald)' }}>+48 this week</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>RECOVERY RATE</span>
            <TrendingUp size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {stats?.returnRate || '82.2%'}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Avg return: 14.5 hrs</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>MATCHED PAIRS</span>
            <GitMerge size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {stats?.totalMatches || 298}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Automated attribute matching</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>MODERATION QUEUE</span>
            <ShieldAlert size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            1
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--rose)' }}>1 flagged report</span>
        </div>
      </div>

      {/* Main Grid: Campus Trends & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }}>
        {/* Campus Lost Item Hotspots */}
        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Campus Lost & Found Hotspots
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { location: "Central Library (Floors 1-3)", count: 142, pct: 85 },
              { location: "Student Union Food Court", count: 98, pct: 60 },
              { location: "Engineering Complex Block B", count: 74, pct: 45 },
              { location: "Sports Recreation Center", count: 46, pct: 28 },
              { location: "Science Lecture Halls", count: 29, pct: 18 }
            ].map((spot, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{spot.location}</span>
                  <span style={{ color: 'var(--slate-500)' }}>{spot.count} items</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${spot.pct}%`, backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Navigation Shortcuts */}
        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
              Administrative Tools
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/admin/users" style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--slate-900)' }}>User Account Directory</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Audit student, officer, and admin roles</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--slate-400)" />
              </Link>

              <Link to="/admin/moderation" style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert size={18} color="var(--rose)" />
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--slate-900)' }}>Moderation Queue (1)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Review reported and spam items</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--slate-400)" />
              </Link>

              <Link to="/admin/analytics" style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BarChart3 size={18} color="#6366f1" />
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--slate-900)' }}>Deep Analytics & Reports</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Recovery velocity & department stats</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--slate-400)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
