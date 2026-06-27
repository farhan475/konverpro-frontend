import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/',
  withCredentials: true, // Crucial for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to handle unauthorized errors
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      // Clear user info from localStorage if token is invalid/expired
      localStorage.removeItem('konverpro_user');
      window.location.href = '/';
    }
  }
  return Promise.reject(error);
});

export default api;
