import api from './axiosConfig.js';
import { MOCK_MATCHES } from './mockData.js';

const isDemo = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('tb_is_demo_session') === 'true' : false);

export const getMyMatches = async () => {
  if (isDemo()) {
    return MOCK_MATCHES;
  }
  try {
    const response = await api.get('/api/matches/my-matches');
    return response.data || [];
  } catch (e) {
    console.warn("Falling back to demo matches due to API error", e);
    return MOCK_MATCHES;
  }
};

export const getMatchesByReport = async ({ lostReportId, foundReportId }) => {
  if (isDemo()) {
    return MOCK_MATCHES.filter(m => 
      (lostReportId && String(m.lostReport?.id) === String(lostReportId)) ||
      (foundReportId && String(m.foundReport?.id) === String(foundReportId))
    );
  }
  try {
    const params = {};
    if (lostReportId) params.lostReportId = lostReportId;
    if (foundReportId) params.foundReportId = foundReportId;
    const response = await api.get('/api/matches/by-report', { params });
    return response.data || [];
  } catch (e) {
    console.warn("Could not fetch matches by report ID", e);
    return [];
  }
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
  getMatchesByReport,
  getMatchDetails
};
