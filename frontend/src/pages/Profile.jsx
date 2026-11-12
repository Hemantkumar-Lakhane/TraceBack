import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  ShieldCheck,
  Phone,
  BookOpen,
  Award,
  Building,
  LogOut,
  CheckCircle2,
  Edit3,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  X,
  FileCheck2,
  KeyRound,
  Lock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AVATAR_PRESETS = [
  { label: 'Aarav (Student)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Rohan (Student)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { label: 'Ananya (Student)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { label: 'Rajesh (Security)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Priya (Dean)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
];

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Sharma',
    studentId: user?.studentId || user?.badgeNumber || 'IITB-2024-CS104',
    department: user?.department || user?.station || 'Computer Science & Engineering',
    phone: user?.phone || '+91 98201 23456',
    hostel: user?.hostel || 'Hostel 14, Room B-208',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || 'Aarav Sharma',
      studentId: user?.studentId || user?.badgeNumber || 'IITB-2024-CS104',
      department: user?.department || user?.station || 'Computer Science & Engineering',
      phone: user?.phone || '+91 98201 23456',
      hostel: user?.hostel || 'Hostel 14, Room B-208',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Full name cannot be empty');
      return;
    }

    if (updateUser) {
      updateUser({
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        badgeNumber: formData.studentId.trim(),
        department: formData.department.trim(),
        station: formData.department.trim(),
        phone: formData.phone.trim(),
        hostel: formData.hostel.trim(),
        avatar: formData.avatar
      });
    }

    toast.success('Profile details updated successfully!');
    setIsEditModalOpen(false);
  };

  const currentPhone = user?.phone || '+91 98201 23456';
  const currentStudentId = user?.studentId || user?.badgeNumber || 'IITB-2024-CS104';
  const currentDepartment = user?.department || user?.station || 'Computer Science & Engineering';
  const currentHostel = user?.hostel || 'Hostel 14, Room B-208';
  const currentAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            User Profile & Credentials
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Verified campus identity for TraceBack Lost & Found network
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleOpenEdit}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Edit3 size={14} /> Edit Profile
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--rose-dark)', borderColor: 'var(--border-color)', gap: '6px' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="surface-card" style={{ padding: '2rem', borderRadius: '14px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentAvatar}
                alt={user?.name || "Avatar"}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-light)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)'
                }}
              />
              <button
                onClick={handleOpenEdit}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'var(--primary)',
                  color: '#fff',
                  border: '2px solid var(--card-bg)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Change Avatar"
              >
                <Camera size={13} />
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  {user?.name || "Aarav Sharma"}
                </h2>
                <span className="badge badge-open" style={{ fontWeight: 700 }}>
                  {user?.role || "STUDENT"}
                </span>
              </div>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '4px', marginBottom: '6px' }}>
                {user?.email || "aarav.sharma@campus.edu"}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--emerald-dark)', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Verified IIT Bombay Student Identity
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenEdit}
            className="btn btn-outline btn-sm"
            style={{ gap: '6px', fontSize: '0.8125rem' }}
          >
            <Edit3 size={13} /> Edit Details
          </button>
        </div>

        {/* Credentials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              STUDENT / BADGE ID
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {currentStudentId}
            </div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Used on campus custody passes
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              DEPARTMENT / STATION
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {currentDepartment}
            </div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Academic division
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              CONTACT PHONE
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {currentPhone}
            </div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Indian Standard Mobile (+91)
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              HOSTEL / CAMPUS RESIDENCE
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '4px' }}>
              {currentHostel}
            </div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Primary campus residence
            </div>
          </div>
        </div>
      </div>

      {/* Quick Security & Hub Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Building size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Campus Custody Vault
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.45 }}>
            Ramanujan Central Security Vault (Ground Floor). Mon–Fri 08:30 AM to 07:00 PM. Helpline: +91 (022) 2576-7000.
          </p>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--emerald-dark)" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
              Physical Verification Protocol
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.45 }}>
            Bring your physical Student ID and digital scannable QR Pass when claiming laptops or wallets at Security.
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div
            className="surface-card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '14px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--slate-50)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  Edit Profile Credentials
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Avatar Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '6px' }}>
                  Choose Profile Avatar
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset.url}
                      alt={preset.label}
                      title={preset.label}
                      onClick={() => setFormData(prev => ({ ...prev, avatar: preset.url }))}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        border: formData.avatar === preset.url ? '3px solid var(--primary)' : '2px solid var(--border-color)',
                        padding: formData.avatar === preset.url ? '2px' : '0',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>

              {/* Student ID & Dept in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Student / Badge ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="IITB-2024-CS104"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Department / Station</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Computer Science & Eng"
                  />
                </div>
              </div>

              {/* Contact Phone (Indian Format) */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Contact Phone (Indian Standard +91) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98201 23456"
                    required
                  />
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', marginTop: '2px', display: 'block' }}>
                  Used by Campus Security to notify you when item claims are verified.
                </span>
              </div>

              {/* Hostel / Residence */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Hostel / Campus Residence</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={formData.hostel}
                    onChange={(e) => setFormData(prev => ({ ...prev, hostel: e.target.value }))}
                    placeholder="Hostel 14, Room B-208"
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <CheckCircle2 size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
