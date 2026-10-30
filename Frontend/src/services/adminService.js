import apiClient from './api';
import { MOCK_ADMIN_DATA } from '../data/mockData';

export const adminService = {
  getAdminStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (err) {
      return { ...MOCK_ADMIN_DATA };
    }
  },

  deleteDocument: async (docId) => {
    try {
      await apiClient.delete(`/admin/documents/${docId}`);
    } catch (err) {
      // offline simulation
    }
    return true;
  },

  approveDocument: async (docId) => {
    try {
      await apiClient.post(`/admin/documents/${docId}/approve`);
    } catch (err) {
      // offline simulation
    }
    return true;
  },
};

export default adminService;

