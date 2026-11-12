import React from 'react';

export const TraceBackLogo = ({ size = 32, showWordmark = true, light = false }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="logoGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Squircle base */}
        <rect width="48" height="48" rx="12" fill={light ? '#0f172a' : '#090d16'} />
        <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke={light ? '#334155' : '#1e293b'} fill="none" />

        {/* Outer Circular Radar Track */}
        <path
          d="M13 24 C13 17.9 17.9 13 24 13 C30.1 13 35 17.9 35 24 C35 27.2 33.6 30.1 31.4 32.1"
          stroke="url(#logoGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Beacon Center Pulse */}
        <circle cx="24" cy="24" r="4.5" fill="url(#logoGrad)" />
        <circle cx="24" cy="24" r="1.8" fill="#ffffff" />

        {/* Trace Vector Needle */}
        <path d="M24 35 L24 28.5" stroke="url(#logoGlow)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="35" r="2.2" fill="#38bdf8" />

        {/* Pointer Arrow Mark */}
        <path d="M15 15 L21 15 L18 12 Z" fill="#38bdf8" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: size >= 36 ? '1.25rem' : '1.125rem',
            letterSpacing: '-0.03em',
            color: light ? '#ffffff' : '#0f172a'
          }}>
            Trace<span style={{ color: '#2563eb' }}>Back</span>
          </span>
          <span style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: light ? '#94a3b8' : '#64748b',
            marginTop: '2px'
          }}>
            Campus Recovery Network
          </span>
        </div>
      )}
    </div>
  );
};

export default TraceBackLogo;
