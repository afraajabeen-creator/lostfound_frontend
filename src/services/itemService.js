import api from './api';

export const itemService = {
  // Search and filter items with optional query parameters
  searchItems: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.keyword) params.append('keyword', filters.keyword);

    const queryString = params.toString();
    const url = queryString ? `/api/items?${queryString}` : '/api/items';
    const response = await api.get(url);
    return response.data;
  },

  // Get single item by ID
  getItemById: async (id) => {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  },

  // Get items reported by current logged-in user
  getMyItems: async () => {
    const response = await api.get('/api/items/my-items');
    return response.data;
  },

  // Upload an image file directly
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/items/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Create new item report
  createItem: async (itemData) => {
    const response = await api.post('/api/items', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/api/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/api/items/${id}`);
    return response.data;
  },
};
