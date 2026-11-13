import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Award,
  CheckCircle2,
  ShieldCheck,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  const handleExportCSV = () => {
    const csvRows = [
      ['Metric', 'Current Period', 'Previous Period', 'Benchmark'],
      ['Average Recovery Turnaround', '14.5 Hours', '17.7 Hours', '< 24 Hours'],
      ['Automated Attribute Correlation', '94.2%', '91.0%', '> 90%'],
      ['Student Custody Honesty Rate', '98.7%', '97.5%', '> 95%'],
      ['Total Handover Claim Passes', '245', '198', 'N/A'],
      ['Security Desk Audits Passed', '100%', '100%', '100%']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `VIT_Pune_TraceBack_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics dataset downloaded for campus audit.');
  };

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
            <span className="badge badge-open">Campus Telemetry</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {CAMPUS_CONFIG.name} Institutional Analytics
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recovery Velocity & Operational Metrics
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Quantitative data on item recovery cycles, attribute matching accuracy, and department-level activity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--slate-100)', borderRadius: '6px', padding: '2px' }}>
            {['7d', '30d', 'semester', 'academic_year'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                style={{
                  background: timeRange === r ? 'var(--text-main)' : 'transparent',
                  color: timeRange === r ? 'var(--bg-color)' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Download size={14} /> Export Audit Report (CSV)
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        <div className="surface-card" style={{ padding: '1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            AVG RESOLUTION SPEED
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent, #2563eb)', marginTop: '4px' }}>
            14.5 Hours
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--emerald)' }}>
            3.2 hours faster than previous semester
          </span>
        </div>

        <div className="surface-card" style={{ padding: '1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            CORRELATION ACCURACY
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--emerald)', marginTop: '4px' }}>
            94.2%
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
            Zero false-claim disputes logged
          </span>
        </div>

        <div className="surface-card" style={{ padding: '1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            STUDENT CUSTODY HANDOVER
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#6366f1', marginTop: '4px' }}>
            98.7%
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
            Items safely deposited to security vault
          </span>
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="admin-two-col-grid">
        {/* Category Breakdown */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Report Frequency by Item Classification
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Electronics (Laptops, Calculators, Smart Watches, Earbuds)', pct: 42, color: 'var(--accent, #2563eb)' },
              { label: 'Wallets, Campus Smart IDs & RFID Access Cards', pct: 28, color: '#b45309' },
              { label: 'Keys, Keyrings & Locker Security FOBs', pct: 15, color: 'var(--emerald)' },
              { label: 'Backpacks, Lab Coats & Document Files', pct: 9, color: '#6366f1' },
              { label: 'Water Bottles, Umbrellas & Personal Accessories', pct: 6, color: 'var(--slate-500)' }
            ].map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.label}</span>
                  <span style={{ fontWeight: 700 }}>{cat.pct}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.pct}%`, backgroundColor: cat.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Activity Breakdown */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Department Participation & Handover Volume
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { dept: 'Computer Engineering', items: 124, resolutionRate: '88%' },
              { dept: 'Artificial Intelligence & Machine Learning (AIML)', items: 98, resolutionRate: '85%' },
              { dept: 'Information Technology', items: 84, resolutionRate: '83%' },
              { dept: 'Mechanical Engineering', items: 68, resolutionRate: '79%' },
              { dept: 'Electronics & Telecommunication', items: 56, resolutionRate: '81%' }
            ].map((d, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8125rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.dept}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>{d.items} total reports</div>
                </div>
                <span className="badge badge-approved" style={{ fontSize: '0.6875rem' }}>
                  {d.resolutionRate} returned
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
