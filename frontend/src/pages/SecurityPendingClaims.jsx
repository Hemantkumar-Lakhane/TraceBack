import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Filter, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import MatchScoreBadge from '../components/MatchScoreBadge';
import { getPendingClaims } from '../api/claimService';

export const SecurityPendingClaims = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const data = await getPendingClaims();
        setClaims(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const filtered = claims.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.claimant?.name?.toLowerCase().includes(q) ||
        c.claimant?.studentId?.toLowerCase().includes(q) ||
        c.item?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Pending Claim Verification Queue
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Officer workspace for cross-examining student submitted proof against physical vault items
          </p>
        </div>

        <Link to="/security" className="btn btn-secondary btn-sm">
          Security Dashboard
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search by student name, ID, or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'RETURNED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                background: statusFilter === s ? 'var(--primary)' : 'var(--slate-100)',
                color: statusFilter === s ? '#ffffff' : 'var(--slate-700)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="surface-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', textAlign: 'left', color: 'var(--slate-500)' }}>
              <th style={{ padding: '12px 16px' }}>Claim ID</th>
              <th style={{ padding: '12px 16px' }}>Claimant Student</th>
              <th style={{ padding: '12px 16px' }}>Vault Item</th>
              <th style={{ padding: '12px 16px' }}>AI Match Score</th>
              <th style={{ padding: '12px 16px' }}>Locker Location</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Security Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading queue...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>No claims found.</td>
              </tr>
            ) : (
              filtered.map(claim => (
                <tr key={claim.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>#{claim.id}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{claim.claimant?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{claim.claimant?.studentId}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{claim.item?.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <MatchScoreBadge score={claim.matchScore || 92} />
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>
                    {claim.item?.storageLocation || 'Central Desk Locker A-12'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={claim.status} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link to={`/security/claims/${claim.id}`} className="btn btn-primary btn-sm" style={{ gap: '4px' }}>
                      Review Claim <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityPendingClaims;
