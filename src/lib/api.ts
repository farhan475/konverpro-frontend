import axios from 'axios';

const defaultBaseURL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8000/`
  : 'http://localhost:8000/';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || defaultBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auth token is stored as an httpOnly cookie by the Laravel API.
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      const requestUrl = error.config?.url || '';
      const isLoginPage = window.location.pathname === '/';
      const isLoginAttempt = requestUrl.includes('/api/auth/login');

      if (!isLoginPage && !isLoginAttempt) {
        // Note: do NOT hard-redirect here — useAuthGuard handles 401 by showing toast + soft redirect.
        // Hard redirect would tear down React tree before toast can render.
      }
    }
  }
  return Promise.reject(error);
});

export default api;
