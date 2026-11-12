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
  UserPlus
} from 'lucide-react';
import LifecycleTracker from '../components/LifecycleTracker';

export const Landing = () => {
  const { loginAs } = useAuth();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            TB
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: '1.0625rem',
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            TraceBack
          </span>
        </Link>

        {/* Center Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/browse" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--slate-600)' }}>
            Browse Items
          </Link>
          <a href="#pipeline" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--slate-600)' }}>
            Recovery Pipeline
          </a>
          <a href="#roles" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--slate-600)' }}>
            Role Portals
          </a>
        </nav>

        {/* Right Auth Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">
            <LogIn size={14} /> Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            <UserPlus size={14} /> Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--slate-200)',
        padding: '3.5rem 1.5rem 4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--slate-100)',
            color: 'var(--slate-700)',
            border: '1px solid var(--slate-200)',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 500,
            marginBottom: '1.25rem'
          }}>
            Campus Lost & Found Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--slate-900)',
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.025em'
          }}>
            Campus Lost & Found Management
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'var(--slate-600)',
            maxWidth: '640px',
            margin: '0 auto 2rem',
            lineHeight: 1.5
          }}>
            Automated multi-parameter matching, authenticated finder communication, and authorized campus security desk custody.
          </p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary">
              <LogIn size={15} /> Access Portal
            </Link>
            <Link to="/browse" className="btn btn-secondary">
              <Search size={15} /> Search Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="pipeline" style={{ padding: '3rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
            Item Recovery Process
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            Structured verification pipeline from initial report to verified handover
          </p>
        </div>

        <LifecycleTracker currentStep={3} />
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ backgroundColor: 'var(--slate-50)', padding: '3.5rem 1.5rem', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
              Enterprise Platform Architecture
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
              Designed for transparency, verification auditability, and student privacy
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* Feature 1 */}
            <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <GitMerge size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Multi-Parameter Matching
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                System algorithm correlates submissions across Item Category (40%), Campus Location (30%), and Time Proximity (30%) to identify matches automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <MessageSquare size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Secure In-App Chat
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                Real-time WebSocket communication allows parties to confirm identifying marks without exposing personal phone numbers or private email addresses.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--slate-100)',
                color: 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Security Desk Custody
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                Turned-in valuables are logged with campus security. Claims require ownership verification before authorized physical release.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Quick Access Section */}
      <section id="roles" style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
          Role-Based Access
        </h2>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Specific role workspaces for students, security personnel, and administrators
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {/* Student Card */}
          <div className="surface-card" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Student Portal</h3>
              <span className="badge badge-open">Student</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Report lost and found items, review matched reports, exchange messages, and submit ownership verification claims.
            </p>
            <button
              onClick={() => {
                loginAs('STUDENT');
                window.location.href = '/dashboard';
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Sign In as Student →
            </button>
          </div>

          {/* Security Card */}
          <div className="surface-card" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Security Desk</h3>
              <span className="badge badge-matched">Security</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Review submitted ownership claims, verify item documentation against vault inventory, and authorize releases.
            </p>
            <button
              onClick={() => {
                loginAs('SECURITY');
                window.location.href = '/security';
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Sign In as Security →
            </button>
          </div>

          {/* Admin Card */}
          <div className="surface-card" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Administration</h3>
              <span className="badge badge-open">Admin</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Monitor recovery rate metrics, audit user permissions, manage moderation queue, and review platform telemetry.
            </p>
            <button
              onClick={() => {
                loginAs('ADMIN');
                window.location.href = '/admin';
              }}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Sign In as Admin →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        backgroundColor: '#0f172a',
        color: 'var(--slate-400)',
        padding: '2rem 1.5rem',
        fontSize: '0.8125rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '1rem' }}>TraceBack</span>
            <p style={{ marginTop: '2px', fontSize: '0.75rem', color: 'var(--slate-400)' }}>Campus Lost & Found Management System</p>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/browse" style={{ color: 'var(--slate-300)' }}>Browse Items</Link>
            <Link to="/login" style={{ color: 'var(--slate-300)' }}>Sign In</Link>
            <Link to="/register" style={{ color: 'var(--slate-300)' }}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
