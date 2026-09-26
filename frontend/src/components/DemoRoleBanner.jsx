import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, Award, Sparkles } from 'lucide-react';

export const DemoRoleBanner = () => {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (role) => {
    loginAs(role);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'SECURITY') navigate('/security');
    else navigate('/dashboard');
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '6px 16px',
      fontSize: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      borderBottom: '1px solid #1e293b'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.6875rem'
        }}>
          ROLE SWITCHER
        </span>
        <span style={{ color: '#94a3b8' }}>
          Current Role: <strong style={{ color: '#ffffff' }}>{user?.role || 'STUDENT'} ({user?.name || 'Guest'})</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#64748b' }}>Quick Switch Demo View:</span>
        <button
          onClick={() => handleSwitch('STUDENT')}
          style={{
            background: user?.role === 'STUDENT' ? '#2563eb' : '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <UserCheck size={12} /> Student
        </button>

        <button
          onClick={() => handleSwitch('SECURITY')}
          style={{
            background: user?.role === 'SECURITY' ? '#059669' : '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Shield size={12} /> Security Officer
        </button>

        <button
          onClick={() => handleSwitch('ADMIN')}
          style={{
            background: user?.role === 'ADMIN' ? '#7c3aed' : '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Award size={12} /> Admin
        </button>
      </div>
    </div>
  );
};

export default DemoRoleBanner;
