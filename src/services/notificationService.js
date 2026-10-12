import api from './api';

export const notificationService = {
  // Get all user notifications
  getNotifications: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  },
};
