import api from './axiosConfig.js';
import { MOCK_ADMIN_DATA } from './mockData.js';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getAdminStats = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.stats;
  }
  try {
    const res = await api.get('/api/admin/stats');
    return {
      ...MOCK_ADMIN_DATA.stats,
      ...res.data
    };
  } catch (err) {
    return MOCK_ADMIN_DATA.stats;
  }
};

export const getAllUsers = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.users;
  }
  try {
    const res = await api.get('/api/admin/users');
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status || 'ACTIVE',
        joined: u.createdAt ? u.createdAt.split('T')[0] : '2026-08-15',
        prn: u.prn || (u.role === 'SECURITY' ? `SEC-${u.id + 400}` : u.role === 'ADMIN' ? `ADM-${u.id + 100}` : `12110${String(u.id).padStart(3, '0')}`)
      }));
    }
    return MOCK_ADMIN_DATA.users;
  } catch (err) {
    return MOCK_ADMIN_DATA.users;
  }
};

export const provisionStaffUser = async (staffData) => {
  if (isDemo()) {
    const newUser = {
      id: Date.now(),
      name: staffData.name,
      email: staffData.email,
      role: staffData.role || 'SECURITY',
      status: 'ACTIVE',
      prn: staffData.prn || (staffData.role === 'SECURITY' ? `SEC-${Math.floor(100 + Math.random() * 900)}` : `ADM-${Math.floor(100 + Math.random() * 900)}`),
      department: staffData.department || 'Campus Security Office',
      phone: staffData.phone || '+91 (020) 2420-2180',
      joined: new Date().toISOString().split('T')[0]
    };
    return newUser;
  }

  try {
    const res = await api.post('/api/admin/users', {
      name: staffData.name,
      email: staffData.email,
      role: staffData.role,
      password: staffData.password || staffData.prn || 'VIT12345678'
    });
    const u = res.data;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status || 'ACTIVE',
      joined: u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      prn: staffData.prn || (u.role === 'SECURITY' ? `SEC-${u.id + 400}` : `ADM-${u.id + 100}`),
      department: staffData.department || 'Campus Administration',
      phone: staffData.phone || '+91 (020) 2420-2180'
    };
  } catch (err) {
    // If backend throws an error message (e.g. duplicate email), bubble it up
    const msg = err.response?.data?.message || err.message || 'Failed to provision staff account';
    throw new Error(msg);
  }
};

export const updateUserRole = async (userId, newRole) => {
  if (isDemo()) {
    return { id: userId, role: newRole };
  }
  try {
    const res = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
    return res.data;
  } catch (err) {
    return { id: userId, role: newRole };
  }
};

export const updateUserStatus = async (userId, newStatus) => {
  if (isDemo()) {
    return { id: userId, status: newStatus };
  }
  try {
    const res = await api.put(`/api/admin/users/${userId}/status`, { status: newStatus });
    return res.data;
  } catch (err) {
    return { id: userId, status: newStatus };
  }
};

export const deleteUser = async (userId) => {
  if (isDemo()) return true;
  await api.delete(`/api/admin/users/${userId}`);
  return true;
};

export const getModerationQueue = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.moderationQueue;
  }
  try {
    const res = await api.get('/api/admin/moderation');
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return MOCK_ADMIN_DATA.moderationQueue;
  } catch (err) {
    return MOCK_ADMIN_DATA.moderationQueue;
  }
};

export const deleteReportByAdmin = async (reportId, type = 'LOST') => {
  if (isDemo()) return true;
  await api.delete(`/api/admin/reports/${reportId}?type=${type}`);
  return true;
};

export default {
  getAdminStats,
  getAllUsers,
  provisionStaffUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getModerationQueue,
  deleteReportByAdmin
};
