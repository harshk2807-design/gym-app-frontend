import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
    }
    return response.data;
  },

  register: async (email, password, full_name) => {
    const response = await api.post('/auth/register', { email, password, full_name });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};
