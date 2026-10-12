import api from './api';

export const claimService = {
  // Submit ownership claim
  submitClaim: async (claimData) => {
    const response = await api.post('/api/claims', claimData);
    return response.data;
  },

  // Student view of their claims (shows 6-digit Handover OTP if verified)
  getMyClaims: async () => {
    const response = await api.get('/api/claims/my-claims');
    return response.data;
  },

  // Admin view of all claims
  getAllClaims: async () => {
    const response = await api.get('/api/claims/all');
    return response.data;
  },

  // View claims for a specific item
  getClaimsByItem: async (itemId) => {
    const response = await api.get(`/api/claims/item/${itemId}`);
    return response.data;
  },

  // Admin approves or rejects claim
  updateClaimStatus: async (claimId, statusData) => {
    const response = await api.put(`/api/claims/${claimId}/status`, statusData);
    return response.data;
  },

  // Admin verifies 6-digit handover OTP at pickup desk
  verifyOtp: async (claimId, otp) => {
    const response = await api.post(`/api/claims/${claimId}/verify-otp`, { otp });
    return response.data;
  },
};
