import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, BookOpen, ArrowRight, ShieldCheck, AlertCircle, Database, Cloud } from 'lucide-react';

export const Register = () => {
  const { register, isSupabase } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await register(name, email, password, { studentId, department });
      toast.success('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
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
      padding: '2rem 1rem',
      background: 'radial-gradient(circle at top, #eff6ff 0%, #f8fafc 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
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
            Student Portal Account Registration
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '12px' }}>
            {isSupabase ? <Cloud size={12} color="var(--primary)" /> : <Database size={12} color="var(--emerald)" />}
            <span>Backend: <strong>{isSupabase ? 'Supabase Auth' : 'Spring Boot REST + MySQL'}</strong></span>
          </div>
        </div>

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
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <label className="form-label" htmlFor="campusEmail">Campus Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="campusEmail"
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
              <label className="form-label" htmlFor="regPassword">Create Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  id="regPassword"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {loading ? 'Creating Account in Database...' : 'Complete Real Registration'} <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
