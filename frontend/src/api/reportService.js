import api from './axiosConfig';
import { MOCK_REPORTS } from './mockData';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const createLostReport = async (formData) => {
  if (isDemo()) {
    const newReport = {
      id: Date.now(),
      type: 'LOST',
      status: 'OPEN',
      date: formData.get('date_lost') || new Date().toISOString(),
      location: formData.get('location') || 'Campus Location',
      item: {
        name: formData.get('name') || 'Unnamed Item',
        category: formData.get('category') || 'OTHER',
        brand: formData.get('brand') || '',
        color: formData.get('color') || '',
        description: formData.get('description') || '',
        image: null
      },
      user: { id: 1, name: 'Alex Johnson', email: 'alex.student@campus.edu' }
    };
    return newReport;
  }

  const response = await api.post('/api/reports/lost', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const createFoundReport = async (formData) => {
  if (isDemo()) {
    const newReport = {
      id: Date.now(),
      type: 'FOUND',
      status: 'OPEN',
      date: formData.get('date_found') || new Date().toISOString(),
      location: formData.get('location') || 'Campus Location',
      item: {
        name: formData.get('name') || 'Unnamed Item',
        category: formData.get('category') || 'OTHER',
        brand: formData.get('brand') || '',
        color: formData.get('color') || '',
        description: formData.get('description') || '',
        image: null
      },
      user: { id: 1, name: 'Alex Johnson', email: 'alex.student@campus.edu' }
    };
    return newReport;
  }

  const response = await api.post('/api/reports/found', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMyReports = async (type) => {
  if (isDemo()) {
    return MOCK_REPORTS.filter(r => !type || r.type === type);
  }

  const response = await api.get(`/api/reports/my?type=${type}`);
  return response.data || [];
};

export const getReports = async (filters = {}) => {
  if (isDemo()) {
    let list = MOCK_REPORTS;
    if (filters.type && filters.type !== 'ALL') list = list.filter(r => r.type === filters.type);
    if (filters.category && filters.category !== 'ALL') list = list.filter(r => r.item?.category === filters.category);
    if (filters.location && filters.location !== 'ALL') list = list.filter(r => r.location?.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r => r.item?.name?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
    }
    return list;
  }

  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
  if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters.location && filters.location !== 'ALL') params.append('location', filters.location);
  const response = await api.get(`/api/reports?${params.toString()}`);
  return response.data || [];
};

export const getReportById = async (id, type = 'lost') => {
  if (isDemo()) {
    const found = MOCK_REPORTS.find(r => String(r.id) === String(id));
    return found || MOCK_REPORTS[0];
  }

  const endpoint = type.toLowerCase() === 'lost' ? `/api/reports/lost/${id}` : `/api/reports/found/${id}`;
  const response = await api.get(endpoint);
  return response.data;
};

export default {
  createLostReport,
  createFoundReport,
  getMyReports,
  getReports,
  getReportById
};
