import React from 'react';

export const MatchScoreBadge = ({ score = 0, breakdown }) => {
  let badgeBg = '#f1f5f9';
  let badgeColor = '#334155';
  let badgeBorder = '#e2e8f0';

  if (score >= 80) {
    badgeBg = '#eff6ff';
    badgeColor = '#1d4ed8';
    badgeBorder = '#dbeafe';
  } else if (score >= 60) {
    badgeBg = '#f0fdf4';
    badgeColor = '#166534';
    badgeBorder = '#dcfce7';
  } else if (score > 0) {
    badgeBg = '#fffbeb';
    badgeColor = '#92400e';
    badgeBorder = '#fef3c7';
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        backgroundColor: badgeBg,
        color: badgeColor,
        border: `1px solid ${badgeBorder}`,
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.01em'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: badgeColor,
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
