import axios from 'axios';

/**
 * Centralized Axios HTTP Client.
 * 
 * VIVA TIP:
 * 1. Base URL is read from environment variable VITE_API_URL (default: http://localhost:8080).
 * 2. Axios Request Interceptor automatically extracts the JWT token from localStorage
 *    and appends the 'Authorization: Bearer <token>' header to every outgoing request.
 * 3. Axios Response Interceptor catches 401 Unauthorized errors and logs out the user cleanly.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lostfound_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('lostfound_token');
      localStorage.removeItem('lostfound_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
