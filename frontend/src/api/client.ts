import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

export const accountApi = {
  getAll: () => api.get('/accounts'),
  create: (data: any) => api.post('/accounts', data),
};

export const transactionApi = {
  getByDateRange: (start: string, end: string) =>
    api.get('/transactions', { params: { start, end } }),
  create: (data: any) => api.post('/transactions', data),
};

export default api;
