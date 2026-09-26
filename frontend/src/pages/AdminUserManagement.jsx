import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Shield, UserCheck, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { getAllUsers, updateUserStatus, updateUserRole } from '../api/adminService';

export const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'SECURITY' });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await updateUserStatus(user.id, nextStatus);
    setUsers(updated);
    toast.success(`Account status for ${user.name} changed to ${nextStatus}`);
  };

  const handleChangeRole = async (userId, newRole) => {
    const updated = await updateUserRole(userId, newRole);
    setUsers(updated);
    toast.success(`User role updated to ${newRole}`);
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const newUser = {
      id: Date.now(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      status: 'ACTIVE',
      joined: new Date().toISOString().split('T')[0]
    };

    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setNewStaff({ name: '', email: '', role: 'SECURITY' });
    toast.success(`Staff account for ${newUser.name} created!`);
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Campus User Directory & Roles
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Audit permissions, provision security personnel, and manage campus account status
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={16} /> Add Staff Account
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="surface-card" style={{ padding: '1rem 1.25rem', borderRadius: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'STUDENT', 'SECURITY', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? 'var(--primary)' : 'var(--slate-100)',
                color: roleFilter === r ? '#ffffff' : 'var(--slate-700)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="surface-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', textAlign: 'left', color: 'var(--slate-500)' }}>
              <th style={{ padding: '12px 16px' }}>User Name</th>
              <th style={{ padding: '12px 16px' }}>Campus Email</th>
              <th style={{ padding: '12px 16px' }}>Current Role</th>
              <th style={{ padding: '12px 16px' }}>Account Status</th>
              <th style={{ padding: '12px 16px' }}>Joined Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading users...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>No users found.</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="form-select"
                      style={{ padding: '3px 8px', fontSize: '0.75rem', width: 'auto' }}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="SECURITY">SECURITY</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${u.status === 'ACTIVE' ? 'badge-approved' : 'badge-rejected'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-500)' }}>{u.joined}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-success'}`}
                      style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Provision New Campus Staff Account">
        <form onSubmit={handleAddStaffSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Officer John Doe"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campus Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. officer.doe@campus.edu"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Account Role</label>
            <select
              className="form-select"
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            >
              <option value="SECURITY">Security Officer</option>
              <option value="ADMIN">Campus Administrator</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
