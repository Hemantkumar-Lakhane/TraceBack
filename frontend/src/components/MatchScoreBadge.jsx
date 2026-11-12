import React from 'react';

export const MatchScoreBadge = ({ score = 0, breakdown }) => {
  let badgeClass = 'badge-open';

  if (score >= 80) {
    badgeClass = 'badge-matched';
  } else if (score >= 60) {
    badgeClass = 'badge-approved';
  } else if (score > 0) {
    badgeClass = 'badge-claim-requested';
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
      <div className={`badge ${badgeClass}`} style={{
        gap: '5px',
        padding: '2px 8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.01em'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block'
        }} />
        <span>{score}% Match</span>
      </div>

      {breakdown && (
        <div style={{ display: 'flex', gap: '6px', fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
          <span title="Category Match Weight (Max 40)">Category: {breakdown.categoryScore || 40}/40</span>
          <span>•</span>
          <span title="Location Proximity (Max 30)">Location: {breakdown.locationScore || 28}/30</span>
          <span>•</span>
          <span title="Timeline Proximity (Max 30)">Time: {breakdown.timelineScore || 24}/30</span>
        </div>
      )}
    </div>
  );
};

export default MatchScoreBadge;
