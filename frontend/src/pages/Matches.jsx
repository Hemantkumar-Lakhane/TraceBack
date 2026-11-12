import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitMerge, ArrowRight, ArrowRightLeft, MessageSquare, FileCheck2, CheckCircle2, MapPin, Calendar } from 'lucide-react';
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
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span className="badge badge-open">Automated Matching</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>40% Category • 30% Location • 30% Timestamp</span>
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Item Matches
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Potential pairs identified by multi-factor attribute correlation
          </p>
        </div>

        <Link to="/report/lost" className="btn btn-outline btn-sm">
          Report Another Item
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
          Loading matches...
        </div>
      ) : matches.length === 0 ? (
        <div className="surface-card" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: '6px' }}>
          <GitMerge size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.35rem' }}>
            No Matches Found Yet
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
            When an item is reported that correlates with your description, it will be listed here with calculated match metrics.
          </p>
          <Link to="/browse" className="btn btn-primary btn-sm">
            Browse Reports
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {matches.map(match => (
            <div
              key={match.id}
              className="surface-card"
              style={{
                borderRadius: '6px',
                padding: '1.25rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)'
              }}
            >
              {/* Match Card Top Row: Match Score & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MatchScoreBadge score={match.matchScore || 92} breakdown={match.breakdown} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Record #{match.id} • {new Date(match.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/matches/${match.id}`} className="btn btn-secondary btn-sm">
                    View Breakdown <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Side-by-Side Comparison Container */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
                gap: '0.75rem',
                alignItems: 'center',
                backgroundColor: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem'
              }}>
                {/* Left: Your Lost Report */}
                <div style={{ backgroundColor: 'var(--card-bg)', padding: '0.875rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="badge badge-lost" style={{ fontSize: '0.6875rem' }}>Lost Report</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>#{match.lostReport?.id}</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '3px' }}>
                    {match.lostReport?.item?.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>Location: {match.lostReport?.location}</span>
                    <span>Date: {new Date(match.lostReport?.dateLost || match.lostReport?.date || Date.now()).toLocaleDateString()}</span>
                    <span>Category: {match.lostReport?.item?.category}</span>
                  </div>
                </div>

                {/* Center Icon */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--slate-200)',
                  color: 'var(--slate-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRightLeft size={14} />
                </div>

                {/* Right: Found Report */}
                <div style={{ backgroundColor: 'var(--card-bg)', padding: '0.875rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="badge badge-found" style={{ fontSize: '0.6875rem' }}>Found Report</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>#{match.foundReport?.id}</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '3px' }}>
                    {match.foundReport?.item?.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>Location: {match.foundReport?.location}</span>
                    <span>Date: {new Date(match.foundReport?.dateFound || match.foundReport?.date || Date.now()).toLocaleDateString()}</span>
                    <span>Category: {match.foundReport?.item?.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                  <CheckCircle2 size={14} color="var(--emerald)" /> Category matched (40/40) • Location building (28/30)
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link to={`/chat/${match.id || 1}`} className="btn btn-secondary btn-sm" style={{ gap: '5px' }}>
                    <MessageSquare size={13} /> Open Verification Chat
                  </Link>
                  <Link to={`/claims/new/${match.id}`} className="btn btn-primary btn-sm" style={{ gap: '5px' }}>
                    <FileCheck2 size={13} /> Claim Item
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
