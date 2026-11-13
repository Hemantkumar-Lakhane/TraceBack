import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, KeyRound, Building2 } from 'lucide-react';
import TraceBackLogo from '../components/TraceBackLogo';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePrnChange = (val) => {
    setStudentId(val);
    if (!password || password === studentId) {
      setPassword(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        password: password || studentId,
        studentId,
        department,
        phone,
        role: 'STUDENT'
      });
      toast.success('Registration successful! Welcome to TraceBack VIT Pune.');
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      toast.error(err.message || 'Registration failed.');
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
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <TraceBackLogo size={36} showWordmark={true} />
          </Link>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            VIT Pune Student Account Registration
          </p>
        </div>

        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '8px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '6px',
              color: 'var(--rose)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div>{errorMsg}</div>
                {errorMsg.toLowerCase().includes('already') && (
                  <div style={{ marginTop: '8px' }}>
                    <Link
                      to={`/login?email=${encodeURIComponent(email)}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'inline-flex' }}
                    >
                      Sign in with this account →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>
            </div>

            {/* PRN Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="stuId">PRN Number (8 Digits) *</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="stuId"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={studentId}
                  onChange={(e) => handlePrnChange(e.target.value)}
                  placeholder="e.g. 12110104"
                  required
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="dept">Academic Department / Engineering Branch *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none', zIndex: 1 }} />
                <select
                  id="dept"
                  className="form-select"
                  style={{
                    paddingLeft: '2.25rem',
                    paddingRight: '2.25rem',
                    paddingTop: '0.625rem',
                    paddingBottom: '0.625rem',
                    fontSize: '0.84375rem',
                    lineHeight: '1.45',
                    cursor: 'pointer'
                  }}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {CAMPUS_CONFIG.departments.map(d => (
                    <option key={d} value={d} style={{ padding: '6px 10px' }}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">VIT Campus Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regEmail"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@vit.edu"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regPhone">Contact Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regPhone"
                  type="tel"
                  autoComplete="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 23456"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="regPassword">Account Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regPassword"
                  type="password"
                  autoComplete="new-password"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
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
              {loading ? 'Creating account...' : 'Create VIT Student Account'} <ArrowRight size={15} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In with PRN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
