import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GitMerge,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { getMatchDetails } from '../api/matchService';

export const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const data = await getMatchDetails(id);
        setMatch(data);
      } catch (err) {
        console.error("Error fetching match details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>Loading comparison details...</div>;
  if (!match) return <div style={{ padding: '3rem', textAlign: 'center', fontSize: '0.875rem' }}>Match record not found.</div>;

  const lost = match.lostReport || {};
  const found = match.foundReport || {};
  const lostItem = lost.item || {};
  const foundItem = found.item || {};
  const breakdown = match.breakdown || { categoryScore: 40, locationScore: 28, timelineScore: 24 };

  const handleDismiss = () => {
    toast.info("Match marked as dismissed.");
    navigate('/matches');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/matches" className="btn btn-ghost btn-sm" style={{ gap: '5px', marginBottom: '4px' }}>
            <ArrowLeft size={14} /> Back to Matches
          </Link>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Match Comparison #{match.id}
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Attribute breakdown comparing lost and found reports
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleDismiss} className="btn btn-secondary btn-sm" style={{ color: 'var(--rose)' }}>
            <XCircle size={13} /> Dismiss
          </button>
          <Link to={`/claims/new/${match.id}`} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <FileCheck2 size={14} /> Submit Claim <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Match Scoring Summary Card */}
      <div className="surface-card" style={{
        padding: '1.125rem 1.25rem',
        borderRadius: '6px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: 'var(--slate-100)',
            color: 'var(--slate-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GitMerge size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                {match.matchScore || 92}% Match Score
              </span>
              <span className="badge badge-matched">High Confidence</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Parameters: Category (40%) • Campus Location (30%) • Timestamp Proximity (30%)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Category</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)' }}>{breakdown.categoryScore}/40</div>
          </div>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Location</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)' }}>{breakdown.locationScore}/30</div>
          </div>
          <div style={{ backgroundColor: 'var(--slate-50)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--slate-200)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 500 }}>Timeline</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)' }}>{breakdown.timelineScore}/30</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left Column: Lost Item */}
        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '6px', borderTop: '3px solid var(--slate-400)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-lost">Lost Report</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>#{lost.id}</span>
          </div>

          <div style={{ height: '150px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            {lostItem.image ? (
              <img src={lostItem.image} alt={lostItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)', fontSize: '0.8125rem' }}>No photo</div>
            )}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            {lostItem.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Category</span>
              <strong>{lostItem.category}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Brand & Color</span>
              <strong>{lostItem.brand || 'N/A'} • {lostItem.color || 'N/A'}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Reported Location</span>
              <strong>{lost.location}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Date Lost</span>
              <strong>{new Date(lost.dateLost || lost.date || Date.now()).toLocaleDateString()}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Notes</span>
              <p style={{ color: 'var(--slate-700)', marginTop: '2px', fontSize: '0.75rem' }}>
                {lostItem.description || 'No additional notes provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Found Item */}
        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '6px', borderTop: '3px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-found">Found Report</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>#{found.id}</span>
          </div>

          <div style={{ height: '150px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            {foundItem.image ? (
              <img src={foundItem.image} alt={foundItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)', fontSize: '0.8125rem' }}>No photo</div>
            )}
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            {foundItem.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Category</span>
              <strong>{foundItem.category}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Brand & Color</span>
              <strong>{foundItem.brand || 'N/A'} • {foundItem.color || 'N/A'}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Found Location</span>
              <strong>{found.location}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Date Found</span>
              <strong>{new Date(found.dateFound || found.date || Date.now()).toLocaleDateString()}</strong>
            </div>
            <div style={{ padding: '6px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.6875rem', display: 'block' }}>Notes</span>
              <p style={{ color: 'var(--slate-700)', marginTop: '2px', fontSize: '0.75rem' }}>
                {foundItem.description || 'No additional notes provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step / Action Box */}
      <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Next Steps: Verification
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            Initiate in-app communication with the finder or submit an ownership verification claim for security desk pickup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/chat" className="btn btn-secondary btn-sm">
            <MessageSquare size={14} /> Open Chat
          </Link>
          <Link to={`/claims/new/${match.id}`} className="btn btn-primary btn-sm">
            <FileCheck2 size={14} /> Submit Claim
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
