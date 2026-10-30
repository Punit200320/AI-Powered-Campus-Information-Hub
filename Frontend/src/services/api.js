import axios from 'axios';

// Base API configuration for Node.js Express backend and FastAPI AI service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT Bearer Token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response handler with graceful fallback
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is unreachable or returns 404/500, log warning and let caller fallback to demo data
    if (!error.response) {
      console.warn('[API Client] Backend server unreachable. Falling back to local simulated mock services.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

