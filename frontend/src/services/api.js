import axios from 'axios';
import { APP_CONFIG } from '../utils/constants';

const api = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('himatif_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes (except login request)
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('himatif_token');
        localStorage.removeItem('himatif_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
