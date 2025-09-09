import axios from 'axios';

// Base URL without trailing slash is expected in VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Attach Token auth header if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Token ${token}`;
  }
  return config;
});

export default api;