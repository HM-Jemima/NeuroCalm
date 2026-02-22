import api from './api';

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getUsers(page = 1, pageSize = 20) {
    const response = await api.get(`/admin/users?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async getModelInfo() {
    const response = await api.get('/admin/model');
    return response.data;
  },
};
