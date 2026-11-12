import api from './axiosConfig.js';
import { MOCK_NOTIFICATIONS } from './mockData.js';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const normalizeNotification = (n) => {
  let link = '/notifications';
  let defaultTitle = 'Campus Alert';

  const type = (n.type || '').toUpperCase();
  const refId = n.referenceId || n.reference_id || 1;

  if (type === 'CHAT') {
    defaultTitle = 'Verification Message';
    link = `/chat/${refId}`;
  } else if (type === 'MATCH') {
    defaultTitle = 'Match Detected';
    link = `/matches/${refId}`;
  } else if (type === 'CLAIM') {
    defaultTitle = 'Verification Claim Update';
    link = `/claims/${refId}`;
  } else if (type === 'VERIFICATION') {
    defaultTitle = 'Security Desk Inspection';
    link = `/claims/${refId}`;
  }

  // Handle various date formats (createdAt from Spring Boot, timestamp from mock)
  const rawDate = n.createdAt || n.timestamp;
  let parsedTimestamp = new Date().toISOString();
  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      parsedTimestamp = d.toISOString();
    }
  }

  return {
    id: n.id,
    type: type || 'NOTIFICATION',
    title: n.title || defaultTitle,
    message: n.message || '',
    referenceId: refId,
    link: n.link || link,
    read: Boolean(n.isRead ?? n.read ?? false),
    timestamp: parsedTimestamp
  };
};

export const getNotifications = async () => {
  if (isDemo()) {
    return (MOCK_NOTIFICATIONS || []).map(normalizeNotification);
  }
  try {
    const res = await api.get('/api/notifications');
    let rawList = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && Array.isArray(res.data.content)) {
      rawList = res.data.content;
    } else if (res.data && Array.isArray(res.data.notifications)) {
      rawList = res.data.notifications;
    }
    return rawList.map(normalizeNotification);
  } catch (err) {
    console.error("Notification load error, using mock data", err);
    return (MOCK_NOTIFICATIONS || []).map(normalizeNotification);
  }
};

export const markAsRead = async (id) => {
  if (isDemo()) return true;
  try {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data;
  } catch (err) {
    console.warn(`Failed to mark notification #${id} as read`, err);
    return null;
  }
};

export const markAllAsRead = async () => {
  if (isDemo()) return true;
  try {
    await api.put('/api/notifications/read-all');
    return true;
  } catch (err) {
    console.warn("Failed to mark all notifications as read", err);
    return false;
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  normalizeNotification
};
