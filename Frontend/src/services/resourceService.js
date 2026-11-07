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

  getResourceSummary: async (id) => {
    try {
      const response = await apiClient.get(`/resources/${id}/summary`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  uploadResource: async (payload, file) => {
    try {
      let response;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        Object.entries(payload || {}).forEach(([k, v]) => {
          if (v !== null && v !== undefined) form.append(k, v);
        });
        response = await apiClient.post('/resources/upload-file', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await apiClient.post('/resources/upload', payload);
      }
      return response.data;
    } catch (err) {
      console.warn('[ResourceService] Upload fallback to simulated database');
      const folderMap = {
        'Previous Year Questions (PYQs)': '1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x',
        'Notices': '1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q',
        'Lecture Notes': '17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw',
        'Brochures': '1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh',
      };
      const folderId = folderMap[payload.category] || '1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x';
      return {
        success: true,
        resource: {
          id: `res_${Date.now()}`,
          ...payload,
          driveUrl: `https://drive.google.com/drive/folders/${folderId}`,
          uploadedAt: 'Just now',
          fileSize: '5.2 MB',
          downloads: 1,
          rating: 5.0,
          facultyVerified: true,
        },
        driveUrl: `https://drive.google.com/drive/folders/${folderId}`,
      };
    }
  },

  getDriveFolders: async () => {
    try {
      const response = await apiClient.get('/resources/drive-folders');
      return response.data;
    } catch (err) {
      return {
        PYQ: 'https://drive.google.com/drive/folders/1ZcOtCA2XA_Rw1khE3ppht_TeipqzcQ1x',
        Notices: 'https://drive.google.com/drive/folders/1mqB0PDUZfZeTakC0rkKZ-ZmyfNLhKl4q',
        Notes: 'https://drive.google.com/drive/folders/17K7qVk7_1LgSACWtp58WsgdTaTLYnOSw',
        Brochures: 'https://drive.google.com/drive/folders/1xeX6Up5WTWc2LU2haBeo2boxAO28Ncsh',
      };
    }
  },
};

export default resourceService;

