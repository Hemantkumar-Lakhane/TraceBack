import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageSquare,
  FileCheck2,
  Users,
  MapPin,
  Laptop,
  CreditCard,
  Key,
  LogIn,
  UserPlus
} from 'lucide-react';
import LifecycleTracker from '../components/LifecycleTracker';

export const Landing = () => {
  const { user, loginAs } = useAuth();

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Top Public Header Bar with Sign In & Sign Up */}
      <header className="surface-glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '70px',
        borderBottom: '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
          }}>
            TB
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.35rem',
            color: 'var(--slate-900)',
            letterSpacing: '-0.02em'
          }}>
            Trace<span style={{ color: 'var(--primary)' }}>Back</span>
          </span>
        </Link>

        {/* Center Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to="/browse" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
            Browse Items
          </Link>
          <a href="#pipeline" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
            Recovery Pipeline
          </a>
          <a href="#roles" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
            Portal Roles
          </a>
        </nav>

        {/* Right Auth Action Buttons (Sign In & Sign Up) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ gap: '6px', fontSize: '0.875rem' }}>
            <LogIn size={16} /> Sign In
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ gap: '6px', fontSize: '0.875rem', boxShadow: 'var(--shadow-glow)' }}>
            <UserPlus size={16} /> Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(circle at 50% 0%, #eff6ff 0%, #ffffff 75%)',
        borderBottom: '1px solid var(--slate-200)',
        padding: '4rem 1.5rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#eff6ff',
            color: 'var(--primary)',
            border: '1px solid #bfdbfe',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            boxShadow: '0 2px 6px rgba(37,99,235,0.1)'
          }}>
            <Sparkles size={16} /> Official University Lost & Found Recovery Network
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em'
          }}>
            Lose Something on Campus? <br />
            <span style={{
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TraceBack Recovers It Faster.
            </span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--slate-600)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Powered by smart <strong>40/30/30 AI matching</strong>, secure student-finder chat, and official campus security verification desks.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ boxShadow: 'var(--shadow-glow)', gap: '8px' }}>
              <LogIn size={18} /> Sign In to Portal
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ gap: '8px' }}>
              <UserPlus size={18} /> Create Student Account
            </Link>
            <Link to="/browse" className="btn btn-outline btn-lg">
              <Search size={18} /> Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section id="pipeline" style={{ padding: '3.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            The TraceBack Golden Path
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem' }}>
            A transparent, 6-step recovery pipeline from report to safe physical return
          </p>
        </div>

        <LifecycleTracker currentStep={3} />
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ backgroundColor: 'var(--slate-50)', padding: '4rem 1.5rem', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Built for Campus Trust & Privacy
            </h2>
            <p style={{ color: 'var(--slate-600)' }}>
              Eliminating lost WhatsApp threads, fake claims, and campus bulletin board spam
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {/* Feature 1 */}
            <div className="surface-card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                40/30/30 Smart Matching
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Our automated algorithm scores potential matches across Category (40%), Campus Location (30%), and Time Proximity (30%) to deliver high-confidence pairing instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="surface-card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: 'var(--emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Private Verification Chat
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Safely communicate with the item finder without exposing your personal phone number or email address. Ask specific identifying questions before filing claims.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="surface-card" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: 'var(--amber-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Campus Security Vault Desk
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                High-value items (MacBooks, phones, wallets) are deposited with campus security. Claims require proof verification before official physical handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Quick Access Section for Demo & Reviewers */}
      <section id="roles" style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
          Explore TraceBack by Role
        </h2>
        <p style={{ color: 'var(--slate-600)', marginBottom: '2.5rem' }}>
          Test the tailored experiences for Students, Security Officers, and Campus Administrators
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Student Card */}
          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Student Portal</h3>
              <span className="badge badge-open">Student</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Report lost/found valuables, browse campus database, review AI matches, chat with finders, and submit ownership claims.
            </p>
            <button
              onClick={() => {
                loginAs('STUDENT');
                window.location.href = '/dashboard';
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Enter as Alex (Student) →
            </button>
          </div>

          {/* Security Card */}
          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid var(--emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Security Desk</h3>
              <span className="badge badge-matched">Officer</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Audit pending claims, review student proof vs physical vault items, and authorize physical handovers.
            </p>
            <button
              onClick={() => {
                loginAs('SECURITY');
                window.location.href = '/security';
              }}
              className="btn btn-success"
              style={{ width: '100%' }}
            >
              Enter as Officer Vance (Security) →
            </button>
          </div>

          {/* Admin Card */}
          <div className="surface-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid var(--indigo)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Administration</h3>
              <span className="badge" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>Admin</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Monitor system health KPIs, audit user accounts, manage moderation flags, and analyze campus recovery metrics.
            </p>
            <button
              onClick={() => {
                loginAs('ADMIN');
                window.location.href = '/admin';
              }}
              className="btn"
              style={{ width: '100%', backgroundColor: 'var(--indigo)', color: 'white' }}
            >
              Enter as Dean Sarah (Admin) →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--slate-900)',
        color: 'var(--slate-400)',
        padding: '3rem 1.5rem',
        borderTop: '1px solid var(--slate-800)',
        fontSize: '0.875rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.125rem' }}>TraceBack</span>
            <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>Official University Campus Lost & Found System</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/browse" style={{ color: 'var(--slate-300)' }}>Browse Items</Link>
            <Link to="/login" style={{ color: 'var(--slate-300)' }}>Portal Login</Link>
            <Link to="/register" style={{ color: 'var(--slate-300)' }}>Student Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
