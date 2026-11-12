import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Shield,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
  KeyRound,
  Trash2,
  Building2,
  Phone,
  Mail,
  ShieldAlert,
  UserX,
  Filter
} from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  getAllUsers,
  provisionStaffUser,
  updateUserStatus,
  updateUserRole,
  deleteUser
} from '../api/adminService';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const AdminUserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeTargetUser, setActiveTargetUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for provisioning new staff account
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'SECURITY',
    prn: '',
    department: 'Central Security Office - Building 1',
    phone: '+91 (020) 2420-2180',
    password: ''
  });

  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Unable to fetch user list from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Safe status toggle with confirmation
  const handleInitiateStatusToggle = (u) => {
    if (currentUser && (u.id === currentUser.id || u.email === currentUser.email)) {
      toast.error('Security Guardrail: You cannot suspend your own active administrator account.');
      return;
    }
    setActiveTargetUser(u);
    setShowConfirmModal(true);
  };

  const handleConfirmStatusToggle = async () => {
    if (!activeTargetUser) return;
    const nextStatus = activeTargetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setIsSubmitting(true);
    try {
      await updateUserStatus(activeTargetUser.id, nextStatus);
      setUsers(prev => prev.map(u => u.id === activeTargetUser.id ? { ...u, status: nextStatus } : u));
      toast.success(`Account status for ${activeTargetUser.name} updated to ${nextStatus}`);
      setShowConfirmModal(false);
      setActiveTargetUser(null);
    } catch (err) {
      toast.error('Failed to update account status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (currentUser && userId === currentUser.id && newRole !== 'ADMIN') {
      toast.error('Security Guardrail: Cannot demote your own active administrator role.');
      return;
    }
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (u) => {
    if (currentUser && (u.id === currentUser.id || u.email === currentUser.email)) {
      toast.error('Security Guardrail: Cannot delete your own active administrator account.');
      return;
    }
    if (!window.confirm(`Permanently remove ${u.name} (${u.email}) from the campus registry? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(u.id);
      setUsers(prev => prev.filter(user => user.id !== u.id));
      toast.success(`Account for ${u.name} removed from campus registry.`);
    } catch (err) {
      toast.error('Failed to delete account.');
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      toast.error('Full Name and Official Campus Email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedPrn = newStaff.prn.trim() ||
        (newStaff.role === 'SECURITY' ? `SEC-${Math.floor(400 + Math.random() * 99)}` : `ADM-${Math.floor(100 + Math.random() * 99)}`);

      const createdUser = await provisionStaffUser({
        name: newStaff.name.trim(),
        email: newStaff.email.trim().toLowerCase(),
        role: newStaff.role,
        prn: generatedPrn,
        department: newStaff.department,
        phone: newStaff.phone,
        password: newStaff.password || generatedPrn
      });

      setUsers(prev => [createdUser, ...prev]);
      setShowAddModal(false);
      setNewStaff({
        name: '',
        email: '',
        role: 'SECURITY',
        prn: '',
        department: 'Central Security Office - Building 1',
        phone: '+91 (020) 2420-2180',
        password: ''
      });
      toast.success(`Account successfully provisioned for ${createdUser.name}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to provision staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Audit Export
  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error('No user data to export.');
      return;
    }
    const headers = ['User ID', 'Full Name', 'Campus Email', 'PRN/ID', 'Role', 'Status', 'Joined Date'];
    const rows = users.map(u => [
      u.id,
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.prn || u.studentId || ''}"`,
      u.role || 'STUDENT',
      u.status || 'ACTIVE',
      u.joined || '2026-08-15'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TraceBack_User_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Campus User Audit CSV exported.');
  };

  // Filter calculations
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && (u.status || 'ACTIVE') !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const nameMatch = (u.name || '').toLowerCase().includes(q);
      const emailMatch = (u.email || '').toLowerCase().includes(q);
      const prnMatch = (u.prn || u.studentId || '').toLowerCase().includes(q);
      const deptMatch = (u.department || '').toLowerCase().includes(q);
      return nameMatch || emailMatch || prnMatch || deptMatch;
    }
    return true;
  });

  const totalCount = safeUsers.length;
  const studentCount = safeUsers.filter(u => u.role === 'STUDENT').length;
  const securityCount = safeUsers.filter(u => u.role === 'SECURITY').length;
  const adminCount = safeUsers.filter(u => u.role === 'ADMIN').length;
  const suspendedCount = safeUsers.filter(u => u.status === 'SUSPENDED').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">Identity & Access Control</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {CAMPUS_CONFIG.name} Security Directory
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Campus User Directory & Access Management
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Audit permissions, provision security personnel, and enforce campus credential policies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
            title="Download CSV report of all registered users"
          >
            <Download size={14} /> Export Audit CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={14} /> Provision Staff Account
          </button>
        </div>
      </div>

      {/* Directory Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
      }}>
        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Total Registered
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {totalCount}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>All verified campus accounts</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Enrolled Students
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {studentCount}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--accent, #2563eb)' }}>8-digit PRN authentication</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Security Officers
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {securityCount}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--emerald)' }}>Active on campus posts</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Administrative Staff
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {adminCount}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Platform governance</span>
        </div>

        <div className="surface-card" style={{ padding: '0.85rem 1.1rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Suspended Accounts
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: suspendedCount > 0 ? 'var(--rose)' : 'var(--text-main)', marginTop: '2px' }}>
            {suspendedCount}
          </div>
          <span style={{ fontSize: '0.6875rem', color: suspendedCount > 0 ? 'var(--rose)' : 'var(--emerald)' }}>
            {suspendedCount > 0 ? 'Locked out from login' : 'Zero lockouts'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="surface-card" style={{
        padding: '0.85rem 1.25rem',
        borderRadius: '8px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--slate-400)'
          }} />
          <input
            type="text"
            placeholder="Search by name, email, PRN, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Status:</span>
          {['ALL', 'ACTIVE', 'SUSPENDED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                background: statusFilter === s ? 'var(--text-main)' : 'var(--slate-100)',
                color: statusFilter === s ? 'var(--bg-color)' : 'var(--slate-600)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Role:</span>
          {['ALL', 'STUDENT', 'SECURITY', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? 'var(--accent, #2563eb)' : 'var(--slate-100)',
                color: roleFilter === r ? '#ffffff' : 'var(--slate-700)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User Directory Table */}
      <div className="surface-card" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--slate-50)',
          fontSize: '0.75rem',
          color: 'var(--slate-500)'
        }}>
          <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{totalCount}</strong> campus accounts</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--accent, #2563eb)', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Clear search filter
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--card-bg)',
                borderBottom: '1px solid var(--border-color)',
                textAlign: 'left',
                color: 'var(--slate-500)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '10px 14px' }}>User Details</th>
                <th style={{ padding: '10px 14px' }}>Campus Email</th>
                <th style={{ padding: '10px 14px' }}>PRN / Identifier</th>
                <th style={{ padding: '10px 14px' }}>System Role</th>
                <th style={{ padding: '10px 14px' }}>Account Status</th>
                <th style={{ padding: '10px 14px' }}>Registered</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
                    Loading campus directory records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                    No campus accounts match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isCurrent = currentUser && (u.id === currentUser.id || u.email === currentUser.email);
                  const isSuspended = u.status === 'SUSPENDED';

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isCurrent ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--slate-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: 'var(--slate-700)',
                            flexShrink: 0
                          }}>
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 700,
                                  backgroundColor: 'var(--slate-200)',
                                  color: 'var(--slate-700)',
                                  padding: '1px 5px',
                                  borderRadius: '3px'
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                              {u.department || (u.role === 'SECURITY' ? 'Central Security Office' : u.role === 'ADMIN' ? 'Dean Office' : 'VIT Pune')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Campus Email */}
                      <td style={{ padding: '10px 14px', color: 'var(--slate-600)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {u.email}
                      </td>

                      {/* PRN / Identifier */}
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--slate-100)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: 'var(--slate-800)'
                        }}>
                          {u.prn || u.studentId || `121100${u.id}`}
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={u.role || 'STUDENT'}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          disabled={isCurrent}
                          className="form-select"
                          style={{
                            padding: '3px 6px',
                            fontSize: '0.75rem',
                            width: 'auto',
                            fontWeight: 600,
                            borderRadius: '4px',
                            opacity: isCurrent ? 0.7 : 1,
                            cursor: isCurrent ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="SECURITY">SECURITY</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '10px 14px' }}>
                        <span className={`badge ${isSuspended ? 'badge-rejected' : 'badge-approved'}`} style={{ fontSize: '0.6875rem' }}>
                          {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '10px 14px', color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                        {u.joined || '2026-08-15'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {/* Suspend / Activate Button */}
                          <button
                            onClick={() => handleInitiateStatusToggle(u)}
                            disabled={isCurrent}
                            className={`btn btn-sm ${isSuspended ? 'btn-success' : 'btn-secondary'}`}
                            style={{
                              fontSize: '0.6875rem',
                              padding: '3px 8px',
                              opacity: isCurrent ? 0.4 : 1,
                              cursor: isCurrent ? 'not-allowed' : 'pointer'
                            }}
                            title={isCurrent ? 'Cannot modify your own account' : isSuspended ? 'Reactivate campus access' : 'Lock campus access'}
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>

                          {/* Temporary Pass Reset Button */}
                          <button
                            onClick={() => {
                              setActiveTargetUser(u);
                              setShowResetModal(true);
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.6875rem', padding: '3px 7px' }}
                            title="Issue temporary authentication pass"
                          >
                            <KeyRound size={12} />
                          </button>

                          {/* Delete Account Button */}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isCurrent}
                            className="btn btn-danger btn-sm"
                            style={{
                              fontSize: '0.6875rem',
                              padding: '3px 7px',
                              opacity: isCurrent ? 0.4 : 1,
                              cursor: isCurrent ? 'not-allowed' : 'pointer'
                            }}
                            title={isCurrent ? 'Cannot delete your own account' : 'Delete account permanently'}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision New Campus Staff Account"
      >
        <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', lineHeight: '1.4' }}>
            Authorized campus administrators can provision institutional credentials for security desk officers, inspection team members, or department coordinators.
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Officer Vikram Deshmukh"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Campus Email *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. vikram.deshmukh@vit.edu"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Account Role *
              </label>
              <select
                className="form-select"
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              >
                <option value="SECURITY">Security Officer</option>
                <option value="ADMIN">Campus Administrator</option>
                <option value="STUDENT">Student Coordinator</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Staff ID / Badge PRN
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={newStaff.role === 'SECURITY' ? 'e.g. SEC-410' : 'e.g. ADM-102'}
                value={newStaff.prn}
                onChange={(e) => setNewStaff({ ...newStaff, prn: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Helpline Phone
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 (020) 2420-2180"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
              Assigned Campus Post / Station
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Central Security Office - Building 1 (Main Gate)"
              value={newStaff.department}
              onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.75rem' }}>
              Initial Password / Passkey
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Leave blank to default to Staff PRN"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
            />
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '2px', display: 'block' }}>
              Staff member will be prompted to change their password on first sign-in.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Provisioning...' : 'Provision Staff Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Suspend/Activate Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={activeTargetUser?.status === 'ACTIVE' ? 'Suspend Campus Account' : 'Reactivate Campus Account'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: activeTargetUser?.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
              color: activeTargetUser?.status === 'ACTIVE' ? 'var(--rose)' : 'var(--emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {activeTargetUser?.status === 'ACTIVE' ? <UserX size={20} /> : <UserCheck size={20} />}
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                {activeTargetUser?.status === 'ACTIVE'
                  ? `Lock authentication for ${activeTargetUser?.name}?`
                  : `Restore active access for ${activeTargetUser?.name}?`}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', lineHeight: '1.4' }}>
                {activeTargetUser?.status === 'ACTIVE'
                  ? 'Suspended users will be immediately disconnected and blocked from logging into the campus portal. Existing lost/found posts will remain secured in the registry.'
                  : 'Reactivating this user will restore their ability to sign in with their registered campus credentials.'}
              </p>
            </div>
          </div>

          <div style={{
            padding: '10px 12px',
            backgroundColor: 'var(--slate-50)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--slate-600)'
          }}>
            Account: <strong>{activeTargetUser?.name}</strong> • Email: <strong>{activeTargetUser?.email}</strong> • Role: <strong>{activeTargetUser?.role}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-secondary btn-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmStatusToggle}
              className={`btn btn-sm ${activeTargetUser?.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : activeTargetUser?.status === 'ACTIVE' ? 'Confirm Suspension' : 'Confirm Reactivation'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Temporary Password Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Issue Temporary Authentication Pass"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
            Generate a one-time credential bypass code for verified students or staff who lost their login credentials.
          </p>

          <div style={{
            padding: '12px',
            backgroundColor: 'var(--slate-50)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>
              TEMPORARY RESET PASSKEY FOR {activeTargetUser?.name?.toUpperCase()}
            </span>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: 'var(--accent, #2563eb)'
            }}>
              VIT-{activeTargetUser?.prn || '2026'}-RESET
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
              Valid for 24 hours at campus security desks.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(`VIT-${activeTargetUser?.prn || '2026'}-RESET`);
                toast.success('Temporary passkey copied to clipboard.');
                setShowResetModal(false);
              }}
              className="btn btn-primary btn-sm"
            >
              Copy Passkey & Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
