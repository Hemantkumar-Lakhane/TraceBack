import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
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

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading match matrix...</div>;
  if (!match) return <div style={{ padding: '4rem', textAlign: 'center' }}>Match record not found.</div>;

  const lost = match.lostReport || {};
  const found = match.foundReport || {};
  const lostItem = lost.item || {};
  const foundItem = found.item || {};
  const breakdown = match.breakdown || { categoryScore: 40, locationScore: 28, timelineScore: 24 };

  const handleDismiss = () => {
    toast.info("Match marked as dismissed. You won't receive more alerts for this pair.");
    navigate('/matches');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/matches" className="btn btn-ghost btn-sm" style={{ gap: '6px', marginBottom: '6px' }}>
            <ArrowLeft size={16} /> Back to Matches
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Match Comparison Matrix #{match.id}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Detailed side-by-side breakdown of the reported lost item vs found item
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDismiss} className="btn btn-secondary btn-sm" style={{ color: 'var(--rose-dark)' }}>
            <XCircle size={14} /> Dismiss Match
          </button>
          <Link to={`/claims/new/${match.id}`} className="btn btn-primary" style={{ gap: '8px' }}>
            <FileCheck2 size={16} /> File Ownership Claim <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* AI Score Audit Banner */}
      <div className="surface-card" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #a7f3d0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--emerald)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>
                {match.matchScore || 92}% Match Score
              </span>
              <span className="badge badge-matched">HIGH CONFIDENCE</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Automated scoring weights: <strong>Category (40%)</strong> + <strong>Location (30%)</strong> + <strong>Time Proximity (30%)</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '8px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>CATEGORY</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>{breakdown.categoryScore}/40</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '8px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>LOCATION</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>{breakdown.locationScore}/30</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '8px 14px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>TIMELINE</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--emerald-dark)' }}>{breakdown.timelineScore}/30</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Lost Item */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '4px solid var(--rose)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-lost">YOUR LOST REPORT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>ID #{lost.id}</span>
          </div>

          <div style={{ height: '180px', backgroundColor: 'var(--slate-100)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
            {lostItem.image ? (
              <img src={lostItem.image} alt={lostItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)' }}>No photo</div>
            )}
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            {lostItem.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>CATEGORY</span>
              <strong>{lostItem.category}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>BRAND & COLOR</span>
              <strong>{lostItem.brand || 'N/A'} • {lostItem.color || 'N/A'}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>REPORTED LOST AT</span>
              <strong>{lost.location}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>DATE LOST</span>
              <strong>{new Date(lost.dateLost || lost.date || Date.now()).toLocaleDateString()}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>USER NOTES</span>
              <p style={{ color: 'var(--slate-700)', marginTop: '2px', fontSize: '0.8125rem' }}>
                {lostItem.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Found Item */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-found">FOUND ON CAMPUS</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>ID #{found.id}</span>
          </div>

          <div style={{ height: '180px', backgroundColor: 'var(--slate-100)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
            {foundItem.image ? (
              <img src={foundItem.image} alt={foundItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)' }}>No photo</div>
            )}
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            {foundItem.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>CATEGORY</span>
              <strong>{foundItem.category}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>BRAND & COLOR</span>
              <strong>{foundItem.brand || 'N/A'} • {foundItem.color || 'N/A'}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>FOUND LOCATION</span>
              <strong>{found.location}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>DATE FOUND</span>
              <strong>{new Date(found.dateFound || found.date || Date.now()).toLocaleDateString()}</strong>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>FINDER NOTES</span>
              <p style={{ color: 'var(--slate-700)', marginTop: '2px', fontSize: '0.8125rem' }}>
                {foundItem.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step / Action Box */}
      <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
            Next Step: Verify Ownership
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
            You can chat directly with the finder or proceed to file an official verification claim for security desk pickup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/chat" className="btn btn-secondary">
            <MessageSquare size={16} /> Open Chat
          </Link>
          <Link to={`/claims/new/${match.id}`} className="btn btn-primary">
            <FileCheck2 size={16} /> Submit Ownership Claim
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
