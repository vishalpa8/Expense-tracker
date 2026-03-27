import axios from 'axios';
import type { TransactionRequest } from '../types/index';

interface AccountCreateRequest {
  accountName: string;
  accountNumber?: string;
  openingBalance: number;
  createdAt?: string;
}

interface AccountUpdateRequest {
  accountName: string;
  accountNumber?: string;
  createdAt?: string;
  openingBalance?: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.setItem('session_message', 'Your session has expired. Please sign in again.');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, password: string, fullName: string) =>
    api.post('/auth/register', { username, password, fullName }),
  logout: () => api.post('/auth/logout'),
  deleteAccount: () => api.delete('/auth/account'),
};

export const accountApi = {
  getAll: () => api.get('/accounts'),
  create: (data: AccountCreateRequest) => api.post('/accounts', data),
  update: (id: number, data: AccountUpdateRequest) => api.put(`/accounts/${id}`, data),
  delete: (id: number) => api.delete(`/accounts/${id}`),
  getBalancesAt: (asOf: string) => api.get<Record<number, { balance: number }>>('/accounts/balances', { params: { asOf } }),
};

export const transactionApi = {
  getByDateRange: (start: string, end: string) =>
    api.get('/transactions', { params: { start, end } }),
  create: (data: TransactionRequest) => api.post('/transactions', data),
  update: (id: number, data: TransactionRequest) => api.put(`/transactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
  getCategories: () => api.get<string[]>('/transactions/categories'),
};

export default api;
