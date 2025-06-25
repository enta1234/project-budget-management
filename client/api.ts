import axios from 'axios';
import { triggerError } from './context/ErrorContext';

const api = axios.create();

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 500) {
      const msg = err.response.data?.message || 'Internal Server Error';
      triggerError(msg);
    }
    return Promise.reject(err);
  }
);

export default api;
