import api from './api';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Toggle user block/unblock status
  toggleBlockUser: async (id) => {
    const response = await api.put(`/api/users/${id}/toggle-block`);
    return response.data;
  },
};
