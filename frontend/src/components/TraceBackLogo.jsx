import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TraceBackLogo = ({ size = 32, showWordmark = true, light }) => {
  let isDarkMode = false;
  let isLuxury = true;
  try {
    const themeContext = useTheme();
    isDarkMode = themeContext?.isDark;
    isLuxury = themeContext?.isLuxury ?? true;
  } catch (e) {
    // Fallback if outside provider
    isDarkMode = false;
    isLuxury = true;
  }

  // Allow explicit override if passed as prop
  const darkModeActive = light !== undefined ? light : isDarkMode;

  // Dynamic Theme Gradients
  const gradStop1 = isLuxury ? '#26160F' : '#1e3a8a';
  const gradStop2 = isLuxury ? '#3B2418' : '#2563eb';
  const gradStop3 = isLuxury ? '#4E3222' : '#0284c7';
  const sweepStop = isLuxury ? '#8EC5FF' : '#38bdf8';
  const accentColor = isLuxury ? '#8EC5FF' : (darkModeActive ? '#38bdf8' : '#2563eb');
  const glowColor = isLuxury ? (darkModeActive ? '#8EC5FF' : '#3B2418') : '#2563eb';

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
          {/* Multi-stop Dynamic Theme Gradient Base */}
          <linearGradient id="tbBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradStop1} />
            <stop offset="45%" stopColor={gradStop2} />
            <stop offset="100%" stopColor={gradStop3} />
          </linearGradient>

          {/* Luminous Inner Arc Sweep */}
          <linearGradient id="tbSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={sweepStop} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Glowing Drop Shadow */}
          <filter id="tbGlowFilter" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor={glowColor} floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Vibrant Gradient Base Squircle */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill="url(#tbBaseGrad)"
          filter="url(#tbGlowFilter)"
        />
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          rx="11.25"
          stroke={accentColor}
          strokeOpacity="0.45"
          fill="none"
        />

        {/* Radar Concentric Calibration Ring */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke={accentColor}
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Outer Circular Radar Sweep Arc */}
        <path
          d="M12 24 C12 17.37 17.37 12 24 12 C30.63 12 36 17.37 36 24 C36 27.5 34.5 30.6 32.1 32.8"
          stroke="url(#tbSweepGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Directional Return Pointer Arrow */}
        <path d="M14 16 L21 13 L18 20 Z" fill="#ffffff" />

        {/* Beacon Center Pulse & Core */}
        <circle cx="24" cy="24" r="5" fill="#ffffff" fillOpacity="0.25" />
        <circle cx="24" cy="24" r="3.2" fill="#ffffff" />
        <circle cx="24" cy="24" r="1.5" fill={isLuxury ? '#3B2418' : '#2563eb'} />

        {/* Return Anchor Pin Point */}
        <path d="M24 35 L24 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="35" r="2.2" fill={accentColor} />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: size >= 36 ? '1.25rem' : '1.125rem',
            letterSpacing: '-0.025em',
            color: darkModeActive ? '#F5EFE6' : 'var(--text-main)'
          }}>
            Trace<span style={{ color: isLuxury ? (darkModeActive ? '#8EC5FF' : '#1D6FB8') : (darkModeActive ? '#38bdf8' : '#2563eb') }}>Back</span>
          </span>
          <span style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: darkModeActive ? '#BFAEA0' : 'var(--text-muted)',
            marginTop: '1px'
          }}>
            Campus Recovery Network
          </span>
        </div>
      )}
    </div>
  );
};

export default TraceBackLogo;
