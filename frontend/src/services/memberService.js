import api from './api';

export const memberService = {
  async getAll(params = {}) {
    const response = await api.get('/members', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  async create(formData) {
    const response = await api.post('/members', formData);
    return response.data;
  },

  async update(id, formData) {
    const response = await api.put(`/members/${id}`, formData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  }
};