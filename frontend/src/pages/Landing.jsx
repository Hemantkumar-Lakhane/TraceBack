import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  GitMerge,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  LogIn,
  UserPlus,
  PlusCircle,
  Clock,
  Shield,
  CheckCircle2,
  FileCheck2,
  Building2,
  HelpCircle,
  PhoneCall,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import LifecycleTracker from '../components/LifecycleTracker';
import TraceBackLogo from '../components/TraceBackLogo';
import MeadowRiseFooter from '@/components/ui/meadow-rise-footer';
import { CAMPUS_CONFIG } from '../config/campusConfig';
import '../LandingAnimations.css';

export const Landing = () => {
  const { loginAs } = useAuth();
  const { isDark, isLuxury, toggleTheme, togglePalette } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-main)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      {/* Top Header */}
      <header className="landing-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '60px',
        backgroundColor: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(0.75rem, 3vw, 2rem)',
        width: '100%',
        maxWidth: '100vw',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        boxSizing: 'border-box'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <TraceBackLogo size={32} showWordmark={true} />
        </Link>

        {/* Center Links (Desktop only) */}
        <nav className="landing-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/browse" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)', textDecoration: 'none' }}>
            Browse Items
          </Link>
          <a href="#featured-cases" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)', textDecoration: 'none' }}>
            Live Recoveries
          </a>
          <a href="#pipeline" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)', textDecoration: 'none' }}>
            Verification Process
          </a>
          <a href="#portals" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-600)', textDecoration: 'none' }}>
            Campus Portals
          </a>
        </nav>

        {/* Right Auth Action Buttons & Theme Toggle */}
        <div className="landing-auth-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Color Palette Swatch Pill */}
          <button
            onClick={togglePalette}
            className="landing-swatch-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'var(--slate-100)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '34px'
            }}
            title="Toggle Color Theme Palette"
            aria-label="Toggle Color Theme Palette"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B2418', border: '1px solid rgba(255, 255, 255, 0.4)', display: 'inline-block' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F2E8DA', border: '1px solid rgba(0, 0, 0, 0.2)', display: 'inline-block' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8EC5FF', display: 'inline-block' }} />
            </div>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'all 0.15s ease'
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="var(--slate-600)" />}
          </button>

          <Link to="/login" className="btn btn-secondary btn-sm landing-signin-btn-desktop">
            <LogIn size={14} /> Sign In
          </Link>

          <Link to="/register" className="btn btn-primary btn-sm landing-register-btn-desktop">
            <UserPlus size={14} /> Register
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="landing-mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          overflowY: 'auto'
        }}>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>
            Browse Items
          </Link>
          <a href="#featured-cases" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>
            Live Recoveries
          </a>
          <a href="#pipeline" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>
            Verification Process
          </a>
          <a href="#portals" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', padding: '0.5rem 0' }}>
            Campus Portals
          </a>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center', gap: '8px' }}>
            <LogIn size={16} /> Sign In to Portal
          </Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center', gap: '8px' }}>
            <UserPlus size={16} /> Register Student Account
          </Link>
          <button
            onClick={() => { togglePalette(); setMobileMenuOpen(false); }}
            className="btn btn-secondary"
            style={{ justifyContent: 'center', gap: '8px' }}
          >
            Switch Palette Theme
          </button>
        </div>
      )}

      {/* Hero Section with Institutional Campus Dot Mesh Banner */}
      <section className="campus-hero-banner">
        <div className="hero-content-wrapper animate-fade-in">
          {/* Official Verification Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Official Campus Lost &amp; Found
          </div>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            margin: '0 auto 1.25rem',
            maxWidth: '850px',
            wordBreak: 'break-word',
            width: '100%'
          }}>
            Campus Item Recovery Platform
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--slate-600)',
            maxWidth: '680px',
            margin: '0 auto 1.75rem',
            lineHeight: 1.6,
            letterSpacing: 'normal'
          }}>
            Deterministic multi-parameter matching, privacy-preserving authenticated chat, and verified campus security desk custody.
          </p>

          {/* Institutional Rotating Item Category Badge */}
          <div className="hero-rotator-badge">
            <span style={{ color: 'var(--slate-600)', fontWeight: 600, fontSize: '0.9375rem' }}>
              TraceBack Recovers
            </span>
            <span className="rotator-flipper">
              <span className="rotator-words">
                <span className="rotator-word">Laptops &amp; MacBooks</span>
                <span className="rotator-word">Wallets &amp; Campus IDs</span>
                <span className="rotator-word">Keys &amp; Access Cards</span>
                <span className="rotator-word">Headphones &amp; Audio</span>
                <span className="rotator-word">Smartphones &amp; Tablets</span>
              </span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="hero-action-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Link to="/report/lost" className="btn btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              <PlusCircle size={16} /> Report Lost Item
            </Link>
            <Link to="/report/found" className="btn btn-secondary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              <PlusCircle size={16} /> Report Found Item
            </Link>
            <Link to="/browse" className="btn btn-outline" style={{ padding: '0.75rem 1.6rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              <Search size={16} /> Browse Campus Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Featured 3D Interactive Perspective Cards Section */}
      <section id="featured-cases" style={{
        padding: '4.5rem 1.5rem',
        backgroundColor: 'var(--slate-50)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-matched" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.75rem'
            }}>
              Live Campus Custody Desk
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Recent Recoveries & Secured Items
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Explore recently reported items and their active verification status across campus.
            </p>
          </div>

          {/* 3D Perspective Cards Grid */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap'
          }}>
            {/* 3D Card 1: MacBook Pro */}
            <div className="parent-3d">
              <div className="card-3d">
                <div className="content-box">
                  <span className="card-title">MacBook Pro 14"</span>
                  <p className="card-content">
                    Found at Dr. APJ Abdul Kalam Central Library desk #14. High confidence match verified by Finder Rohan Verma.
                  </p>
                  <Link to="/login" className="see-more" style={{ textDecoration: 'none' }}>
                    View Case File →
                  </Link>
                </div>
                <div className="date-box">
                  <span className="month">NOV</span>
                  <span className="date">12</span>
                </div>
              </div>
            </div>

            {/* 3D Card 2: Titan Leather Wallet */}
            <div className="parent-3d">
              <div className="card-3d">
                <div className="content-box" style={{ background: 'rgba(2, 132, 199, 0.85)' }}>
                  <span className="card-title">Titan Leather Wallet</span>
                  <p className="card-content">
                    Recovered at Sharad Arena Canteen. Contains campus ID with PRN 12110104. Secured in Locker A-12.
                  </p>
                  <Link to="/login" className="see-more" style={{ textDecoration: 'none' }}>
                    View Case File →
                  </Link>
                </div>
                <div className="date-box" style={{ borderColor: 'rgb(2, 132, 199)' }}>
                  <span className="month" style={{ color: 'rgb(2, 132, 199)' }}>NOV</span>
                  <span className="date" style={{ color: 'rgb(2, 132, 199)' }}>10</span>
                </div>
              </div>
            </div>

            {/* 3D Card 3: Sony WH-1000XM5 */}
            <div className="parent-3d">
              <div className="card-3d">
                <div className="content-box" style={{ background: 'rgba(30, 58, 138, 0.88)' }}>
                  <span className="card-title">Sony Headphones</span>
                  <p className="card-content">
                    Found at Visvesvaraya Engineering Block B Lab 104. Verified and logged by Inspector Rajesh Kumar.
                  </p>
                  <Link to="/login" className="see-more" style={{ textDecoration: 'none' }}>
                    View Case File →
                  </Link>
                </div>
                <div className="date-box" style={{ borderColor: 'rgb(30, 58, 138)' }}>
                  <span className="month" style={{ color: 'rgb(30, 58, 138)' }}>NOV</span>
                  <span className="date" style={{ color: 'rgb(30, 58, 138)' }}>08</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle Workflow Pipeline */}
      <section id="pipeline" style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            Campus Recovery Pipeline
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            Every reported item follows an auditable 5-step institutional lifecycle
          </p>
        </div>

        <LifecycleTracker currentStep={3} />
      </section>

      {/* Role Portals Grid */}
      <section id="portals" style={{
        backgroundColor: 'var(--bg-color)',
        padding: '4rem 1.5rem',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              Dedicated Stakeholder Workspaces
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Role-based access control built for students, security personnel, and administrators
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '1.5rem'
          }}>
            {/* Student Portal Card */}
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(37, 99, 235, 0.18)' : '#eff6ff',
                color: isDark ? '#38bdf8' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <FileCheck2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Student Portal
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Report lost items, browse campus finds, receive instant match notifications, chat securely with finders, and generate pickup vouchers.
              </p>
              <button
                onClick={() => loginAs('STUDENT')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Launch Student Portal (Aarav) <ArrowRight size={14} />
              </button>
            </div>

            {/* Security Desk Portal Card */}
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(5, 150, 105, 0.18)' : '#f0fdf4',
                color: isDark ? '#34d399' : '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Security Vault Desk
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Log items into physical lockers, audit claimant verification evidence, verify device unlock codes, and authorize physical handovers.
              </p>
              <button
                onClick={() => loginAs('SECURITY')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Launch Security Desk (Rajesh) <ArrowRight size={14} />
              </button>
            </div>

            {/* Campus Admin Portal Card */}
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(124, 58, 237, 0.18)' : '#faf5ff',
                color: isDark ? '#c084fc' : '#7e22ce',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Building2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
                Administrative Console
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Monitor university-wide turnaround metrics, review flagged reports, manage user status, and inspect institutional return rate telemetry.
              </p>
              <button
                onClick={() => loginAs('ADMIN')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Launch Admin Console (Priya) <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Closing Canvas & Platform Footer */}
      <MeadowRiseFooter
        name="TraceBack"
        brandHref="/"
        heading="Recover what is *rightfully yours*&#10;across VIT Pune."
        subheading="Official item custody, deterministic matching, and physical verification at Building 1 Central Security Desk."
        cta={{ label: "Report or Browse Items", href: "/browse" }}
        tagline="Empowering Vishwakarma Institute of Technology, Pune with verified, privacy-preserving campus recovery."
        preset="auto"
        height="840px"
        heroHeight="clamp(380px, 50svh, 540px)"
      />
    </div>
  );
};

export default Landing;
