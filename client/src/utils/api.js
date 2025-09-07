import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/users/login', { email, password }).then(res => res.data),
  
  register: (username, email, password) => 
    api.post('/users/register', { username, email, password }).then(res => res.data),
  
  getProfile: () => 
    api.get('/users/profile').then(res => res.data),
};

// Journal API
export const journalAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/journal?page=${page}&limit=${limit}`).then(res => res.data),
  
  getById: (id) => 
    api.get(`/journal/${id}`).then(res => res.data),
  
  create: (journalData) => 
    api.post('/journal', journalData).then(res => res.data),
  
  update: (id, journalData) => 
    api.put(`/journal/${id}`, journalData).then(res => res.data),
  
  delete: (id) => 
    api.delete(`/journal/${id}`).then(res => res.data),
};

// Mood API
export const moodAPI = {
  getAll: (period = 'month') => 
    api.get(`/mood?period=${period}`).then(res => res.data),
  
  getStats: (period = 'month') => 
    api.get(`/mood/stats?period=${period}`).then(res => res.data),
  
  create: (moodData) => 
    api.post('/mood', moodData).then(res => res.data),
  
  update: (id, moodData) => 
    api.put(`/mood/${id}`, moodData).then(res => res.data),
  
  delete: (id) => 
    api.delete(`/mood/${id}`).then(res => res.data),
};

export default api;