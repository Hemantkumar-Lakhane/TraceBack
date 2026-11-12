import api from './axiosConfig';
import { MOCK_CLAIMS } from './mockData';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const submitClaim = async (formData) => {
  if (isDemo()) {
    const newClaim = {
      id: Date.now(),
      matchId: formData.get('match_id') || 1,
      claimant: { name: "Aarav Sharma", studentId: "IITB-2024-CS104" },
      item: { name: formData.get('item_name') || "Item", storageLocation: "Ramanujan Central Security Vault" },
      matchScore: 92,
      verificationAnswers: {
        secretMarks: formData.get('secret_marks'),
        serialNumber: formData.get('serial_number'),
        pickupDate: formData.get('pickup_date'),
        pickupTime: formData.get('pickup_time')
      },
      status: "PENDING",
      submittedAt: new Date().toISOString()
    };
    return newClaim;
  }

  const response = await api.post('/api/claims', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMyClaims = async () => {
  if (isDemo()) {
    return MOCK_CLAIMS;
  }
  const response = await api.get('/api/claims/my');
  return response.data || [];
};

export const getPendingClaims = async () => {
  if (isDemo()) {
    return MOCK_CLAIMS;
  }
  const response = await api.get('/api/claims/pending');
  return response.data || [];
};

export const updateClaimStatus = async (claimId, status, reviewNotes = '') => {
  if (isDemo()) {
    return { id: claimId, status, reviewNotes };
  }
  const response = await api.put(`/api/claims/${claimId}/status`, { status, reviewNotes });
  return response.data;
};

export default {
  submitClaim,
  getMyClaims,
  getPendingClaims,
  updateClaimStatus
};
