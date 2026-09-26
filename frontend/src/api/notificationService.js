import api from './axiosConfig';
import { MOCK_NOTIFICATIONS } from './mockData';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getNotifications = async () => {
  if (isDemo()) {
    return MOCK_NOTIFICATIONS;
  }
  const res = await api.get('/api/notifications');
  return res.data || [];
};

export const markAsRead = async (id) => {
  if (isDemo()) return;
  const res = await api.put(`/api/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  if (isDemo()) return [];
  const res = await api.put('/api/notifications/read-all');
  return res.data;
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead
};
