import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, PlusCircle, Search, MapPin, Tag, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { MOCK_REPORTS } from '../api/mockData';

export const SecurityInventory = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(MOCK_REPORTS.filter(r => r.type === 'FOUND'));

  const filtered = items.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.item?.name?.toLowerCase().includes(q) ||
      i.item?.category?.toLowerCase().includes(q) ||
      i.storageLocation?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Security Vault & Custody Inventory
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Physical locker and shelf registry for items deposited at campus security
          </p>
        </div>

        <Link to="/security/report/found" className="btn btn-success" style={{ gap: '6px' }}>
          <PlusCircle size={16} /> Log New Found Item
        </Link>
      </div>

      {/* Search */}
      <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '14px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search vault locker or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem'
      }}>
        {filtered.map(report => (
          <div
            key={report.id}
            className="surface-card"
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--slate-200)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-found" style={{ fontSize: '0.6875rem' }}>
                  {report.storageLocation || 'Vault Shelf'}
                </span>
                <StatusBadge status={report.status} />
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                {report.item?.name}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                Category: {report.item?.category} • Found at: {report.location}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                Date: {new Date(report.date || Date.now()).toLocaleDateString()}
              </span>
              <Link to={`/reports/found/${report.id}`} className="btn btn-outline btn-sm">
                View Record
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityInventory;
