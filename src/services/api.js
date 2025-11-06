import axios from 'axios';

// Create React App environment variables use REACT_APP_ prefix
// Access with process.env (NOT import.meta.env)
// When using proxy, we should use relative paths
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Debug logs
console.log('================================================');
console.log('🔗 API CONFIGURATION');
console.log('================================================');
console.log('Environment:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('================================================');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  withCredentials: false
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      responseURL: error.request?.responseURL,
      configBaseURL: error.config?.baseURL,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => {
    console.log('📝 Register API call');
    return api.post('/auth/register', data);
  },
  login: (data) => {
    console.log('🔐 Login API call');
    return api.post('/auth/login', data);
  },
  getMe: () => {
    console.log('👤 Get profile API call');
    return api.get('/auth/me');
  }
};

// Plants API
export const plantAPI = {
  getAll: () => api.get('/plants'),
  getById: (id) => api.get(`/plants/${id}`),
  create: (data) => api.post('/plants', data),
  update: (id, data) => api.put(`/plants/${id}`, data),
  delete: (id) => api.delete(`/plants/${id}`)
};

// Tasks API
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  complete: (id) => api.patch(`/tasks/${id}/complete`)
};

// Diagnosis API
export const diagnosisAPI = {
  identifyPlant: (imageBase64) => {
    console.log('🔍 Plant identification');
    return api.post('/diagnosis/identify', { imageBase64 });
  },
  diagnosePlantHealth: (plantId, imageBase64) => {
    console.log('🏥 Plant diagnosis');
    return api.post('/diagnosis/health', { plantId, imageBase64 });
  }
};

// Weather API
export const weatherAPI = {
  get: (lat, lon) => {
    // If lat and lon are not provided or are invalid, don't include them in the query
    if (!lat || !lon || lat === 'undefined' || lon === 'undefined') {
      return api.get('/weather');
    }
    return api.get(`/weather?lat=${lat}&lon=${lon}`);
  }
};

// Community API
export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  getPost: (id) => api.get(`/community/posts/${id}`),
  createPost: (data) => api.post('/community/posts', data),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  likePost: (id) => api.put(`/community/posts/${id}/like`),
  commentOnPost: (id, comment) => api.post(`/community/posts/${id}/comments`, { comment })
};

// Marketplace API
export const marketplaceAPI = {
  getProducts: (params) => api.get('/marketplace/products', { params }),
  getProduct: (id) => api.get(`/marketplace/products/${id}`),
  searchProducts: (query) => api.get(`/marketplace/products/search?q=${query}`)
};

// Quote API
export const quoteAPI = {
  request: (data) => api.post('/quotes/request', data),
  getAll: () => api.get('/quotes'),
  getById: (id) => api.get(`/quotes/${id}`)
};

// Plant Database API
export const plantDatabaseAPI = {
  getAll: () => api.get('/plant-database'),
  search: (query, page = 1) => api.get('/plant-database/search', { 
    params: { q: query, page } 
  }),
  getDetails: (id) => api.get(`/plant-database/${id}`),
  identifyPlant: (imageBase64) => api.post('/diagnosis/identify', { imageBase64 }, { timeout: 30000 })
};

export default api;