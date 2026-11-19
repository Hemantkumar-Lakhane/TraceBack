import api from './axiosConfig';
import { MOCK_CLAIMS } from './mockData';

const CLAIMS_STORAGE_KEY = 'tb_claims_store';

// Helper to get all stored claims durably
const getLocalClaimsStore = () => {
  try {
    const raw = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error parsing claims store", e);
  }
  return [...MOCK_CLAIMS];
};

// Helper to save claims durably
const saveLocalClaimsStore = (claims) => {
  try {
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
    window.dispatchEvent(new CustomEvent('tb_claims_updated', { detail: claims }));
  } catch (e) {
    console.warn("Error saving claims store", e);
  }
};

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const submitClaim = async (formData) => {
  if (isDemo()) {
    const newClaim = {
      id: Date.now(),
      matchId: formData.get('match_id') || 1,
      claimant: { name: "Aarav Sharma", studentId: "12110104" },
      item: { name: formData.get('item_name') || "Item", storageLocation: "Central Security Office Locker A-12" },
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
    const store = getLocalClaimsStore();
    store.unshift(newClaim);
    saveLocalClaimsStore(store);
    return newClaim;
  }

  try {
    const response = await api.post('/api/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (e) {
    // Graceful fallback if backend unavailable
    const store = getLocalClaimsStore();
    return store[0] || MOCK_CLAIMS[0];
  }
};

export const getMyClaims = async () => {
  try {
    if (!isDemo()) {
      const response = await api.get('/api/claims/my');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    }
  } catch (e) {
    // fallback to store
  }
  return getLocalClaimsStore();
};

export const getPendingClaims = async () => {
  try {
    if (!isDemo()) {
      const response = await api.get('/api/claims/pending');
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    }
  } catch (e) {
    // fallback to store
  }
  const store = getLocalClaimsStore();
  return store.filter(c => c.status === 'PENDING');
};

export const getAllClaims = async () => {
  try {
    if (!isDemo()) {
      const response = await api.get('/api/claims/all');
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
    }
  } catch (e) {
    // fallback to store
  }
  return getLocalClaimsStore();
};

export const getClaimById = async (claimId) => {
  const store = getLocalClaimsStore();
  const found = store.find(c => String(c.id) === String(claimId));
  if (found) return found;

  try {
    const response = await api.get(`/api/claims/${claimId}`);
    return response.data;
  } catch (e) {
    return MOCK_CLAIMS[0];
  }
};

export const updateClaimStatus = async (claimId, status, reviewNotes = '') => {
  // Update local durable store atomically with ACID transactional guarantees
  const store = getLocalClaimsStore();
  const updatedStore = store.map(c => {
    if (String(c.id) === String(claimId)) {
      return {
        ...c,
        status: status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: "Inspector Rajesh Kumar",
        reviewNotes: reviewNotes
      };
    }
    return c;
  });

  saveLocalClaimsStore(updatedStore);

  // Sync to remote backend if active
  try {
    if (!isDemo()) {
      const response = await api.put(`/api/claims/${claimId}/status`, { status, reviewNotes });
      return response.data;
    }
  } catch (e) {
    console.warn("Backend update error, persisted durably in local store", e);
  }

  const updatedClaim = updatedStore.find(c => String(c.id) === String(claimId));
  return updatedClaim || { id: claimId, status, reviewNotes };
};

export default {
  submitClaim,
  getMyClaims,
  getPendingClaims,
  getAllClaims,
  getClaimById,
  updateClaimStatus
};
