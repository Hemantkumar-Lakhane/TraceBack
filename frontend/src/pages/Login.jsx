import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { DEMO_USERS } from '../api/mockData';
import TraceBackLogo from '../components/TraceBackLogo';

export const Login = () => {
  const { login } = useAuth();
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
      toast.success(`Welcome, ${data.user.name}`);
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <TraceBackLogo size={36} showWordmark={true} />
          </Link>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            Sign in to your campus account
          </p>
        </div>

        {/* Card */}
        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', backgroundColor: '#ffffff' }}>
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '6px',
              color: 'var(--rose)',
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
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@campus.edu"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Password</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', cursor: 'pointer' }} onClick={() => toast.info("Default password for all test accounts is 'password123'")}>
                  Default: password123
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
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
              style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '8px', textAlign: 'center' }}>
              Quick fill credentials for review:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('STUDENT')}
                className="btn btn-secondary btn-sm"
              >
                Aarav (Student)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('SECURITY')}
                className="btn btn-secondary btn-sm"
              >
                Rajesh (Security)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('ADMIN')}
                className="btn btn-secondary btn-sm"
              >
                Priya (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
          Need an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
