import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/dashboard/notifications');
    return response.data;
  },
};
