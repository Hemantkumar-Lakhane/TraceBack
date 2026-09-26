import api from './axiosConfig';
import { MOCK_ADMIN_DATA } from './mockData';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getAdminStats = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.stats;
  }
  const res = await api.get('/api/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.users;
  }
  const res = await api.get('/api/admin/users');
  return res.data || [];
};

export const updateUserRole = async (userId, newRole) => {
  if (isDemo()) {
    return { id: userId, role: newRole };
  }
  const res = await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
  return res.data;
};

export const updateUserStatus = async (userId, newStatus) => {
  if (isDemo()) {
    return { id: userId, status: newStatus };
  }
  return { id: userId, status: newStatus };
};

export const getModerationQueue = async () => {
  if (isDemo()) {
    return MOCK_ADMIN_DATA.moderationQueue;
  }
  return [];
};

export const deleteReportByAdmin = async (reportId, type = 'LOST') => {
  if (isDemo()) return true;
  await api.delete(`/api/admin/reports/${reportId}?type=${type}`);
  return true;
};

export default {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  getModerationQueue,
  deleteReportByAdmin
};
