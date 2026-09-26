import React from 'react';
import { BarChart3, TrendingUp, PieChart, MapPin, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../api/mockData';

export const AdminAnalytics = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Campus Recovery Analytics & Insights
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
          Deep telemetry on lost item frequency, recovery velocity, and AI match success rates
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>AVG RECOVERY TIME</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>14.5 Hours</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-dark)' }}>↓ 3.2 hrs faster than last term</span>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>AI 40/30/30 MATCH ACCURACY</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '6px' }}>94.2%</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Zero false-claim disputes</span>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>STUDENT RETURN HONESTY INDEX</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1', marginTop: '6px' }}>98.7%</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Items handed into custody</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Lost Item Frequency by Category
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: "Electronics (Laptops, Earbuds, Phones)", pct: 42, color: "var(--primary)" },
            { label: "Wallets, Purses & Campus IDs", pct: 28, color: "#b45309" },
            { label: "Keys & Keychains", pct: 15, color: "var(--emerald)" },
            { label: "Bags & Backpacks", pct: 9, color: "#6366f1" },
            { label: "Water Bottles & Other Valuables", pct: 6, color: "var(--slate-500)" }
          ].map((cat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{cat.label}</span>
                <span style={{ fontWeight: 700 }}>{cat.pct}%</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--slate-100)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${cat.pct}%`, backgroundColor: cat.color, borderRadius: '5px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
