import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  ArrowRight,
  User,
  Search,
  CheckCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import MatchScoreBadge from '../components/MatchScoreBadge';
import { getPendingClaims } from '../api/claimService';
import { MOCK_REPORTS } from '../api/mockData';

export const SecurityDashboard = () => {
  const { user } = useAuth();
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const data = await getPendingClaims();
        setPendingClaims(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const vaultItems = MOCK_REPORTS.filter(r => r.type === 'FOUND' && r.status !== 'RETURNED');
  const returnedItems = MOCK_REPORTS.filter(r => r.status === 'RETURNED');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Security Header */}
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
            <span className="badge badge-matched">Security Operations</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Badge: {user?.badgeNumber || 'SEC-409'}</span>
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Security Operations Hub
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Station: Central Security Desk (Student Union Hall)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/security/report/found" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <PlusCircle size={14} /> Log Turned-In Item
          </Link>
          <Link to="/security/inventory" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Archive size={14} /> Custody Inventory
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>PENDING CLAIMS</span>
            <Clock size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {pendingClaims.filter(c => c.status === 'PENDING').length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Requires verification</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>CUSTODY ITEMS</span>
            <Archive size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {vaultItems.length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>In locker storage</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>RETURNS COMPLETED</span>
            <CheckCheck size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {returnedItems.length + 14}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--emerald)' }}>Verified & released</span>
        </div>
      </div>

      {/* Main Action Section: Claim Verification Queue */}
      <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
              Pending Ownership Claims
            </h3>
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
              Cross-reference student submitted markings against physical custody
            </span>
          </div>
          <Link to="/security/claims" className="btn btn-outline btn-sm">
            View All Claims →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading claims...</div>
        ) : pendingClaims.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
            <CheckCircle2 size={36} color="var(--emerald)" style={{ margin: '0 auto 8px' }} />
            <p>Verification queue is clear. No pending claims.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingClaims.map(claim => (
              <div
                key={claim.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--amber-dark)'
                  }}>
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {claim.item?.name}
                      </h4>
                      <MatchScoreBadge score={claim.matchScore || 92} />
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
                      Claimant: <strong>{claim.claimant?.name}</strong> ({claim.claimant?.studentId}) • Vault: <strong>{claim.item?.storageLocation || 'Locker A-12'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/security/claims/${claim.id}`} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                    <ShieldCheck size={14} /> Audit & Verify Claim <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Grid: Vault Inventory & Recent Returns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Vault Locker Highlights */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Storage Lockers</h3>
            <Link to="/security/inventory" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Full Vault →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Locker A-12:</strong> Apple MacBook Air
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Deposited by David Kim</div>
              </div>
              <span className="badge badge-claim-requested">Claim Pending</span>
            </div>

            <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Shelf 4:</strong> Sony WH-1000XM4 Headphones
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Found in Lab 104</div>
              </div>
              <span className="badge badge-open">In Vault</span>
            </div>
          </div>
        </div>

        {/* Recent Returns Log */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Recent Returns Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--emerald-dark)' }}>Hydro Flask 32oz</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>Verified by Officer Marcus Vance</div>
              </div>
              <span className="badge badge-approved">RETURNED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
