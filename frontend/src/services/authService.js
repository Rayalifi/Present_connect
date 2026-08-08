import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('himatif_token');
      localStorage.removeItem('himatif_user');
    }
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/password', { currentPassword, newPassword });
    return response.data;
  }
};
