import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  PhoneCall
} from 'lucide-react';
import LifecycleTracker from '../components/LifecycleTracker';
import TraceBackLogo from '../components/TraceBackLogo';
import '../LandingAnimations.css';

export const Landing = () => {
  const { loginAs } = useAuth();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <TraceBackLogo size={32} showWordmark={true} />
        </Link>

        {/* Center Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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

        {/* Right Auth Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">
            <LogIn size={14} /> Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            <UserPlus size={14} /> Register
          </Link>
        </div>
      </header>

      {/* Hero Section with Parallax Starfield Canvas */}
      <section className="starfield-container" style={{
        position: 'relative',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4.5rem 1.5rem 5rem',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        {/* Parallax Star Layers */}
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>

        {/* Hero Content with Intro Fade */}
        <div id="title" style={{ position: 'relative', zIndex: 10, maxWidth: '860px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#93c5fd',
            marginBottom: '1.5rem',
            letterSpacing: '0.03em'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
            Official University Lost & Found Infrastructure
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 auto 1rem'
          }}>
            Campus Item Recovery Platform
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            maxWidth: '660px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.6
          }}>
            Deterministic multi-parameter matching, privacy-preserving authenticated chat, and verified campus security desk custody.
          </p>

          {/* User Requested Dynamic Rotating Word Flipper */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.25rem' }}>
            <div className="words-card" style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '6px 20px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <div className="loader" style={{ height: '36px', alignItems: 'center' }}>
                <p style={{ margin: 0, paddingRight: '10px', color: '#cbd5e1', fontSize: '1rem', fontWeight: 600 }}>
                  TraceBack Recovers
                </p>
                <div className="words">
                  <span className="word" style={{ color: '#38bdf8', fontWeight: 700 }}>Laptops</span>
                  <span className="word" style={{ color: '#818cf8', fontWeight: 700 }}>Wallets</span>
                  <span className="word" style={{ color: '#34d399', fontWeight: 700 }}>Keychains</span>
                  <span className="word" style={{ color: '#f472b6', fontWeight: 700 }}>College IDs</span>
                  <span className="word" style={{ color: '#38bdf8', fontWeight: 700 }}>Smartphones</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report/lost" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              <PlusCircle size={16} /> Report Lost Item
            </Link>
            <Link to="/report/found" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              <PlusCircle size={16} /> Report Found Item
            </Link>
            <Link to="/browse" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
              <Search size={16} /> Browse Campus Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Featured 3D Interactive Perspective Cards Section */}
      <section id="featured-cases" style={{
        padding: '4.5rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid var(--slate-200)'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 10px',
              borderRadius: '4px',
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
              Hover over case cards to view 3D telemetry and security clearance checkpoints.
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
                    Recovered at Ramanujan Student Center Cafeteria. Contains campus ID IITB-2024-CS104. Secured in Locker A-12.
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
        backgroundColor: '#ffffff',
        padding: '4rem 1.5rem',
        borderTop: '1px solid var(--slate-200)',
        borderBottom: '1px solid var(--slate-200)'
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Student Portal Card */}
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
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
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                color: '#166534',
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
            <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#faf5ff',
                color: '#7e22ce',
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

      {/* Support & Helpline Toolbar with User-Requested Social Tooltips */}
      <section style={{ backgroundColor: 'var(--slate-900)', color: '#ffffff', padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Campus Safety & Helpdesk Channels
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Instant custody inquiries, physical locker appointments, or student assistance.
          </p>

          {/* User Requested Animated Example-2 Social / Action Links */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ul className="example-2" style={{ flexDirection: 'row', padding: 0, margin: 0 }}>
              {/* Telegram Support Channel */}
              <li className="icon-content">
                <a
                  href="https://telegram.org/"
                  aria-label="Telegram"
                  data-social="telegram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="filled"></div>
                  <svg version="1.1" viewBox="0 0 100 100">
                    <path
                      d="M95,9.9c-1.3-1.1-3.4-1.2-7-0.1c0,0,0,0,0,0c-2.5,0.8-24.7,9.2-44.3,17.3c-17.6,7.3-31.9,13.7-33.6,14.5  c-1.9,0.6-6,2.4-6.2,5.2c-0.1,1.8,1.4,3.4,4.3,4.7c3.1,1.6,16.8,6.2,19.7,7.1c1,3.4,6.9,23.3,7.2,24.5c0.4,1.8,1.6,2.8,2.2,3.2  c0.1,0.1,0.3,0.3,0.5,0.4c0.3,0.2,0.7,0.3,1.2,0.3c0.7,0,1.5-0.3,2.2-0.8c3.7-3,10.1-9.7,11.9-11.6c7.9,6.2,16.5,13.1,17.3,13.9  c0,0,0.1,0.1,0.1,0.1c1.9,1.6,3.9,2.5,5.7,2.5c0.6,0,1.2-0.1,1.8-0.3c2.1-0.7,3.6-2.7,4.1-5.4c0-0.1,0.1-0.5,0.3-1.2  c3.4-14.8,6.1-27.8,8.3-38.7c2.1-10.7,3.8-21.2,4.8-26.8c0.2-1.4,0.4-2.5,0.5-3.2C96.3,13.5,96.5,11.2,95,9.9z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <div className="tooltip">Help Desk</div>
              </li>

              {/* Dribbble / Design Portal */}
              <li className="icon-content">
                <a
                  href="#pipeline"
                  aria-label="Campus Portal"
                  data-social="dribbble"
                >
                  <div className="filled"></div>
                  <svg version="1.1" viewBox="0 0 100 100">
                    <path
                      d="M83.5,18.5C74.9,9.3,62.8,4,50.2,4c-6.1,0-12,1.1-17.6,3.4C15.2,14.5,4,31.3,4,50c0,13.9,6.2,26.9,17,35.7  C29.2,92.3,39.4,96,50,96c6.6,0,13.2-1.5,19.2-4.2c12.5-5.7,21.7-16.6,25.2-29.8C95.5,57.9,96,53.8,96,50  C96,38.3,91.6,27.1,83.5,18.5z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <div className="tooltip">Portal</div>
              </li>

              {/* Spotify / Radio Helpline */}
              <li className="icon-content">
                <a
                  href="tel:+912225767000"
                  aria-label="Security Desk Hotline"
                  data-social="spotify"
                >
                  <div className="filled"></div>
                  <svg version="1.1" viewBox="0 0 100 100">
                    <path
                      d="M50,4C24.7,4,4,24.7,4,50s20.6,46,46,46s46-20.6,46-46S75.4,4,50,4z M71.6,71.5c-0.8,1.2-2,1.8-3.2,1.8 c-0.7,0-1.4-0.2-2-0.6c-10.2-6.3-23.3-7.7-38.8-4.1c-2.1,0.6-4-0.9-4.5-2.7c-0.6-2.3,0.9-4.1,2.7-4.6c17.7-4,32.6-2.3,44.4,5 c0.9,0.4,1.5,1,1.8,1.9C72.2,69.3,72.1,70.5,71.6,71.5z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <div className="tooltip">Hotline</div>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.8125rem', color: '#64748b' }}>
            Ramanujan Central Security Vault: <strong>+91 (022) 2576-7000</strong> (Ext. 409) • Hours: 08:00 - 20:00 IST
          </div>
        </div>
      </section>

      {/* Symmetrical Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--slate-200)',
        padding: '2rem 1.5rem',
        fontSize: '0.8125rem',
        color: 'var(--slate-500)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TraceBackLogo size={24} showWordmark={true} />
          </div>

          <div>
            TraceBack Campus Lost & Found System • Operational Audit Standard ISO 27001
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/browse" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Directory</Link>
            <Link to="/login" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
