import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TraceBackLogo = ({ size = 34, showWordmark = true, light }) => {
  let isDarkMode = false;
  let isLuxury = false;
  try {
    const themeContext = useTheme();
    isDarkMode = themeContext?.isDark;
    isLuxury = themeContext?.isLuxury ?? false;
  } catch (e) {
    isDarkMode = false;
    isLuxury = false;
  }

  const darkModeActive = light !== undefined ? light : isDarkMode;

  // Modern Accent Colors
  const primaryBrand = darkModeActive ? '#8EC5FF' : '#3B2418';
  const pulseAccent = darkModeActive ? '#60A5FA' : '#C28B5B';
  const ringColor = darkModeActive ? 'rgba(142, 197, 255, 0.35)' : 'rgba(59, 36, 24, 0.25)';
  const beaconBg = darkModeActive ? '#121214' : '#3B2418';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible' }}
      >
        <style>
          {`
            @keyframes tbRadarSweep {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes tbBeaconPulse {
              0% { r: 6px; opacity: 0.9; }
              50% { r: 16px; opacity: 0.2; }
              100% { r: 20px; opacity: 0; }
            }
            @keyframes tbCoreGlow {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.12); opacity: 0.85; }
            }
            .tb-radar-sweep {
              transform-origin: 22px 22px;
              animation: tbRadarSweep 7s linear infinite;
            }
            .tb-pulse-ring {
              animation: tbBeaconPulse 2.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
            }
            .tb-core-dot {
              transform-origin: 22px 22px;
              animation: tbCoreGlow 2.8s ease-in-out infinite;
            }
          `}
        </style>

        {/* Outer Squircle Container with Soft Shadow */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="12"
          fill={beaconBg}
          stroke={ringColor}
          strokeWidth="1.5"
        />

        {/* Concentric Search Radar Rings */}
        <circle cx="22" cy="22" r="15" stroke={ringColor} strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="22" cy="22" r="10" stroke={ringColor} strokeWidth="1" />

        {/* Animated Expanding Recovery Pulse Wave */}
        <circle
          className="tb-pulse-ring"
          cx="22"
          cy="22"
          r="6"
          fill="none"
          stroke={pulseAccent}
          strokeWidth="1.75"
        />

        {/* Rotating Radar Search Beam */}
        <g className="tb-radar-sweep">
          <path
            d="M22 22 L22 7 A15 15 0 0 1 35 15 Z"
            fill="url(#radarBeamGradient)"
            opacity="0.38"
          />
          <line x1="22" y1="22" x2="22" y2="7" stroke={pulseAccent} strokeWidth="1.75" strokeLinecap="round" />
        </g>

        {/* Target Reticle Crosshairs */}
        <line x1="22" y1="3" x2="22" y2="6" stroke={pulseAccent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="38" x2="22" y2="41" stroke={pulseAccent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="22" x2="6" y2="22" stroke={pulseAccent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="38" y1="22" x2="41" y2="22" stroke={pulseAccent} strokeWidth="1.5" strokeLinecap="round" />

        {/* Central Verified Location Core Pin */}
        <circle cx="22" cy="22" r="4.5" fill={darkModeActive ? '#8EC5FF' : '#FFFFFF'} />
        <circle className="tb-core-dot" cx="22" cy="22" r="2.5" fill={darkModeActive ? '#0A0A0A' : '#C28B5B'} />

        <defs>
          <radialGradient id="radarBeamGradient" cx="22" cy="22" r="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={pulseAccent} stopOpacity="0.7" />
            <stop offset="100%" stopColor={pulseAccent} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{
            fontFamily: 'var(--font-display, inherit)',
            fontWeight: 700,
            fontSize: size >= 36 ? '1.25rem' : '1.125rem',
            letterSpacing: '-0.025em',
            color: darkModeActive ? '#FFFFFF' : '#1C0D06'
          }}>
            Trace<span style={{ color: darkModeActive ? '#8EC5FF' : '#B45309' }}>Back</span>
          </span>
          <span className="tb-logo-sub" style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: darkModeActive ? '#A1A1AA' : '#6B584C',
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
