import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        studentId,
        department,
        phone,
        role: 'STUDENT'
      });
      toast.success('Registration successful! Welcome to TraceBack.');
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
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9375rem'
            }}>
              TB
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
              TraceBack
            </span>
          </Link>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            Student Account Registration
          </p>
        </div>

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
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="stuId">Student ID</label>
                <input
                  id="stuId"
                  type="text"
                  className="form-input"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU-89241"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dept">Department</label>
                <select
                  id="dept"
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                  <option value="Business Admin">Business Admin</option>
                  <option value="Arts & Design">Arts & Design</option>
                  <option value="Biomedical Science">Biomedical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">Campus Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regEmail"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.name@campus.edu"
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
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="regPassword">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regPassword"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={15} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--slate-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
