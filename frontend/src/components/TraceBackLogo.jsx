import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TraceBackLogo = ({ size = 32, showWordmark = true, light }) => {
  let isDarkMode = false;
  try {
    const themeContext = useTheme();
    isDarkMode = themeContext?.isDark;
  } catch (e) {
    // Fallback if outside provider
    isDarkMode = false;
  }

  // Allow explicit override if passed as prop
  const darkModeActive = light !== undefined ? light : isDarkMode;

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
          {/* Vibrant Multi-stop Tech Gradient Base */}
          <linearGradient id="tbBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Luminous Inner Arc Sweep */}
          <linearGradient id="tbSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Glowing Drop Shadow */}
          <filter id="tbGlowFilter" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2563eb" floodOpacity="0.3" />
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
          stroke="#60a5fa"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Radar Concentric Calibration Ring */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke="#93c5fd"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        {/* Outer Circular Radar Sweep Arc in Crisp Luminous White/Cyan */}
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
        <circle cx="24" cy="24" r="1.5" fill="#2563eb" />

        {/* Return Anchor Pin Point */}
        <path d="M24 35 L24 28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="35" r="2.2" fill="#38bdf8" />
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: size >= 36 ? '1.25rem' : '1.125rem',
            letterSpacing: '-0.025em',
            color: darkModeActive ? '#f8fafc' : '#0f172a'
          }}>
            Trace<span style={{ color: darkModeActive ? '#38bdf8' : '#2563eb' }}>Back</span>
          </span>
          <span style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: darkModeActive ? '#94a3b8' : '#64748b',
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
