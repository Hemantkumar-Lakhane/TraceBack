import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, Award } from 'lucide-react';

export const DemoRoleBanner = () => {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (role) => {
    loginAs(role);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'SECURITY') navigate('/security');
    else navigate('/dashboard');
  };

  return null; // Demoted from visible layout to preserve clean production styling
};

export default DemoRoleBanner;
