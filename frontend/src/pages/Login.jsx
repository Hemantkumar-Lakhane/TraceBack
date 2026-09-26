import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserCheck, Shield, Award, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Database, Cloud } from 'lucide-react';
import { DEMO_USERS } from '../api/mockData';

export const Login = () => {
  const { login, loginAs, isSupabase } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFillDemo = (role) => {
    setErrorMsg('');
    if (role === 'STUDENT') {
      setEmail(DEMO_USERS.student.email);
      setPassword('password123');
    } else if (role === 'SECURITY') {
      setEmail(DEMO_USERS.security.email);
      setPassword('password123');
    } else if (role === 'ADMIN') {
      setEmail(DEMO_USERS.admin.email);
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'SECURITY') navigate('/security');
      else if (data.user.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = (role) => {
    loginAs(role);
    toast.success(`Logged in as ${role === 'ADMIN' ? 'Dean Sarah (Admin)' : role === 'SECURITY' ? 'Officer Vance (Security)' : 'Alex Johnson (Student)'}`);
    if (role === 'SECURITY') navigate('/security');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at top, #eff6ff 0%, #f8fafc 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              TB
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--slate-900)' }}>
              Trace<span style={{ color: 'var(--primary)' }}>Back</span>
            </span>
          </Link>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Official Campus Authentication Portal
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '12px' }}>
            {isSupabase ? <Cloud size={12} color="var(--primary)" /> : <Database size={12} color="var(--emerald)" />}
            <span>Auth Mode: <strong>{isSupabase ? 'Supabase Auth' : 'Spring Boot REST + MySQL'}</strong></span>
          </div>
        </div>

        {/* Card */}
        <div className="surface-card" style={{ padding: '2rem', borderRadius: '18px', boxShadow: 'var(--shadow-lg)' }}>
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: 'var(--rose-dark)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Campus Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Password</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => toast.info("For demo accounts use 'password123'")}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>
                Demo Quick Fill:
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                Auto-fill credentials
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('STUDENT')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px 4px' }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('SECURITY')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px 4px', color: 'var(--emerald-dark)' }}
              >
                Security
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('ADMIN')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px 4px', color: 'var(--indigo)' }}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          Don't have a campus account?{' '}
          <Link to="/register" style={{ fontWeight: 700 }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
