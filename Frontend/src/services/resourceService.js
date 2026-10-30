import apiClient from './api';
import { MOCK_RESOURCES } from '../data/mockData';

export const resourceService = {
  searchResources: async ({ query = '', category = 'All', department = 'All', semester = 'All' } = {}) => {
    try {
      const response = await apiClient.get('/resources/search', {
        params: { query, category, department, semester },
      });
      return response.data;
    } catch (err) {
      // Offline fallback
      let results = [...MOCK_RESOURCES];

      if (query.trim()) {
        const q = query.toLowerCase();
        results = results.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q)) ||
            r.subject.toLowerCase().includes(q)
        );
      }

      if (category !== 'All') {
        results = results.filter((r) => r.category === category);
      }

      if (department !== 'All') {
        results = results.filter((r) => r.department === department);
      }

      if (semester !== 'All') {
        results = results.filter((r) => r.semester === semester);
      }

      return results;
    }
  },

  getTopResources: async () => {
    try {
      const response = await apiClient.get('/resources/top');
      return response.data;
    } catch (err) {
      return [...MOCK_RESOURCES].sort((a, b) => b.downloads - a.downloads);
    }
  },

  getResourceById: async (id) => {
    const found = MOCK_RESOURCES.find((r) => r.id === id);
    return found || MOCK_RESOURCES[0];
  },
};

export default resourceService;

