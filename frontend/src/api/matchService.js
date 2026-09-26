import api from './axiosConfig';
import { MOCK_MATCHES } from './mockData';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getMyMatches = async () => {
  if (isDemo()) {
    return MOCK_MATCHES;
  }
  const response = await api.get('/api/matches/my-matches');
  return response.data || [];
};

export const getMatchDetails = async (id) => {
  if (isDemo()) {
    const found = MOCK_MATCHES.find(m => String(m.id) === String(id));
    return found || MOCK_MATCHES[0];
  }
  const response = await api.get(`/api/matches/${id}`);
  return response.data;
};

export default {
  getMyMatches,
  getMatchDetails
};
