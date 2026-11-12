import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, ArrowRight, QrCode, Clock, MapPin, Calendar, GitMerge } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getMyClaims } from '../api/claimService';

export const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const data = await getMyClaims();
        setClaims(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            My Claims & Pickup Passes
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Track the verification progress of items you have claimed from campus finders
          </p>
        </div>

        <Link to="/matches" className="btn btn-outline btn-sm">
          <GitMerge size={14} /> View Matches
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--slate-400)' }}>
          Loading your claims...
        </div>
      ) : claims.length === 0 ? (
        <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px' }}>
          <FileCheck2 size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            No Claims Submitted Yet
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            When you find a matching item, click "Claim This Item" to submit proof of ownership to Campus Security.
          </p>
          <Link to="/matches" className="btn btn-primary">
            Review My Matches
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {claims.map(c => (
            <div
              key={c.id}
              className="surface-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                border: '1px solid var(--slate-200)'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {c.item?.name}
                    </h4>
                    <StatusBadge status={c.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    <span>Location: {c.item?.storageLocation || 'Central Security Desk'}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(c.submittedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/claims/${c.id}`} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  <QrCode size={14} /> View Voucher & Pass <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
