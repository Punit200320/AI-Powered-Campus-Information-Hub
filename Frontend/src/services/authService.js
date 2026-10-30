import apiClient from './api';
import { DEMO_USERS } from '../context/AuthContext';

export const authService = {
  login: async (email, password, role = 'student') => {
    try {
      const response = await apiClient.post('/auth/login', { email, password, role });
      if (response.data?.token) {
        localStorage.setItem('campusai_token', response.data.token);
      }
      return response.data;
    } catch (err) {
      // Graceful fallback to demo user
      const user = DEMO_USERS[role] || {
        ...DEMO_USERS.student,
        email,
        name: email.split('@')[0],
        role,
      };
      localStorage.setItem('campusai_token', 'mock_jwt_token_2026');
      return { user, token: 'mock_jwt_token_2026', isMock: true };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      return {
        user: {
          id: `usr_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'student',
          department: userData.department || 'Computer Science & Engineering',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
        token: 'mock_jwt_token_new_user',
        isMock: true,
      };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Ignored for demo
    } finally {
      localStorage.removeItem('campusai_token');
    }
  },
};

export default authService;

