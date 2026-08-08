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
    const isFormData = formData instanceof FormData;
    const response = await api.post('/members', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async update(id, formData) {
    const isFormData = formData instanceof FormData;
    const response = await api.put(`/members/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  }
};
