import axios from 'axios';

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

export default api;
