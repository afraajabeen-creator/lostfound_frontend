import api from './api';

export const authService = {
  // Register student
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('lostfound_token', response.data.data.token);
      localStorage.setItem('lostfound_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login student or admin
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('lostfound_token', response.data.data.token);
      localStorage.setItem('lostfound_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('lostfound_token');
    localStorage.removeItem('lostfound_user');
  },

  // Retrieve saved user from localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem('lostfound_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Retrieve saved token from localStorage
  getStoredToken: () => {
    return localStorage.getItem('lostfound_token');
  },
};
