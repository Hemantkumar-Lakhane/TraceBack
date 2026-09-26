import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowRightLeft, MessageSquare, FileCheck2, CheckCircle2, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import { getMyMatches } from '../api/matchService';

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const data = await getMyMatches();
        setMatches(data || []);
      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">AI MATCHING ENGINE</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>40% Category • 30% Location • 30% Timeline</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            My Item Matches
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Review potential pairs identified by our automated multi-factor scoring engine
          </p>
        </div>

        <Link to="/report/lost" className="btn btn-outline btn-sm">
          Report Another Item
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--slate-400)' }}>
          Loading AI matches...
        </div>
      ) : matches.length === 0 ? (
        <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px' }}>
          <Sparkles size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            No Matches Found Yet
          </h3>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            When a campus member or security officer reports an item matching your description, it will automatically appear here with a confidence score.
          </p>
          <Link to="/browse" className="btn btn-primary">
            Browse All Campus Reports
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {matches.map(match => (
            <div
              key={match.id}
              className="surface-card"
              style={{
                borderRadius: '18px',
                padding: '1.5rem',
                border: '1.5px solid #bfdbfe',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: '#ffffff'
              }}
            >
              {/* Match Card Top Row: Match Score & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MatchScoreBadge score={match.matchScore || 92} breakdown={match.breakdown} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    Match Record #{match.id} • Generated {new Date(match.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/matches/${match.id}`} className="btn btn-primary btn-sm">
                    View Side-by-Side Breakdown <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Side-by-Side Comparison Container */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
                gap: '1rem',
                alignItems: 'center',
                backgroundColor: 'var(--slate-50)',
                padding: '1.25rem',
                borderRadius: '14px',
                border: '1px solid var(--slate-200)',
                marginBottom: '1.25rem'
              }}>
                {/* Left: Your Lost Report */}
                <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-lost" style={{ fontSize: '0.6875rem' }}>Your Lost Report</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>#{match.lostReport?.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                    {match.lostReport?.item?.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span>Location: {match.lostReport?.location}</span>
                    <span>Date: {new Date(match.lostReport?.dateLost || match.lostReport?.date || Date.now()).toLocaleDateString()}</span>
                    <span>Category: {match.lostReport?.item?.category}</span>
                  </div>
                </div>

                {/* Center Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #bfdbfe'
                }}>
                  <ArrowRightLeft size={16} />
                </div>

                {/* Right: Found Report */}
                <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid var(--slate-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-found" style={{ fontSize: '0.6875rem' }}>Found by {match.foundReport?.user?.name || 'Campus Member'}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>#{match.foundReport?.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '4px' }}>
                    {match.foundReport?.item?.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span>Location: {match.foundReport?.location}</span>
                    <span>Date: {new Date(match.foundReport?.dateFound || match.foundReport?.date || Date.now()).toLocaleDateString()}</span>
                    <span>Category: {match.foundReport?.item?.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--emerald-dark)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Category matched (40/40) • Same Location Building (28/30)
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/chat" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    <MessageSquare size={14} /> Message Finder
                  </Link>
                  <Link to={`/claims/new/${match.id}`} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                    <FileCheck2 size={14} /> Claim This Item
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
