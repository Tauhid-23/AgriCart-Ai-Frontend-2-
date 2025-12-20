import axios from 'axios';

// When using proxy, we should use relative paths
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('🔐 Authentication failed - Token invalid or expired');
      
      // Clear invalid token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Show user-friendly message
      alert('Your session has expired. Please login again.');
      
      // Redirect to login (but not if already there)
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('❌ Network error - backend might be down');
      error.message = 'Cannot connect to server. Please check your internet connection.';
    }
    
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Plant API
export const plantAPI = {
  getAll: () => api.get('/plants'),
  getById: (id) => api.get(`/plants/${id}`),
  create: (data) => api.post('/plants', data),
  update: (id, data) => api.put(`/plants/${id}`, data),
  delete: (id) => api.delete(`/plants/${id}`),
  addNote: (id, data) => api.post(`/plants/${id}/notes`, data),
  updateCare: (id, data) => api.put(`/plants/${id}/care`, data),
  addHarvest: (id, data) => api.post(`/plants/${id}/harvest`, data),
  addGrowthTracking: (id, data) => api.post(`/plants/${id}/growth`, data)
};

// Task API
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getByDateRange: (startDate, endDate) => api.get('/tasks/range', { params: { startDate, endDate } })
};

// Plant Database (Perenual)
export const plantDatabaseAPI = {
  getAll: () => api.get('/plant-database'),
  search: (query, page = 1) => api.get('/plant-database/search', { 
    params: { q: query, page } 
  }),
  getDetails: (id) => api.get(`/plant-database/${id}`),
  identifyPlant: (imageBase64) => api.post('/diagnosis/identify', { imageBase64 }, { timeout: 30000 })
};

// Community API
export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  getPostById: (id) => api.get(`/community/posts/${id}`),
  createPost: (data) => api.post('/community/posts', data),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  addReply: (id, data) => api.post(`/community/posts/${id}/reply`, data),
  getPopularCategories: () => api.get('/community/categories')
};

// Update diagnosisAPI to handle longer timeouts:
export const diagnosisAPI = {
  identifyPlant: (imageBase64) => api.post('/diagnosis/identify', { imageBase64 }, { timeout: 30000 }),
  diagnosePlantHealth: (plantId, imageBase64) => api.post('/diagnosis/health', { plantId, imageBase64 }, { timeout: 30000 })
};

// Weather API
export const weatherAPI = {
  get: (lat, lon) => api.get('/weather', { params: { lat, lon } })
};

// Quote API
export const quoteAPI = {
  create: (data) => api.post('/quotes', data),
  getAll: () => api.get('/quotes')
};

export default api;