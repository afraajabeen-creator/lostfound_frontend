import api from './api';

export const matchService = {
  // Get possible matches for a specific item
  getMatchesForItem: async (itemId) => {
    const response = await api.get(`/api/matches/item/${itemId}`);
    return response.data;
  },

  // Get all possible matches for current user's reported items
  getMyMatches: async () => {
    const response = await api.get('/api/matches/my-matches');
    return response.data;
  },
};
