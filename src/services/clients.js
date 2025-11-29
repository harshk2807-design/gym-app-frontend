import api from './api';

export const clientService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/clients?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  renewPlan: async (id, planData) => {
    const response = await api.post(`/clients/${id}/renew`, planData);
    return response.data;
  },

  addPayment: async (id, paymentData) => {
    const response = await api.post(`/clients/${id}/payment`, paymentData);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
