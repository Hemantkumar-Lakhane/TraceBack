import React from 'react';
import { Sparkles } from 'lucide-react';

export const MatchScoreBadge = ({ score = 0, breakdown }) => {
  let badgeBg = '#ecfdf5';
  let badgeColor = '#047857';
  let badgeBorder = '#a7f3d0';

  if (score < 60) {
    badgeBg = '#fffbeb';
    badgeColor = '#b45309';
    badgeBorder = '#fde68a';
  } else if (score >= 85) {
    badgeBg = '#eff6ff';
    badgeColor = '#1d4ed8';
    badgeBorder = '#bfdbfe';
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: badgeBg,
        color: badgeColor,
        border: `1px solid ${badgeBorder}`,
        borderRadius: '20px',
        fontSize: '0.8125rem',
        fontWeight: 700
      }}>
        <Sparkles size={14} />
        <span>{score}% Match Confidence</span>
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
