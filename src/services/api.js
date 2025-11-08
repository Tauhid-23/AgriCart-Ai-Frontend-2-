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

// Create axios instance with ultra-safe defaults
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

// ULTRA-SAFE Response interceptor
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

// ULTRA-SAFE marketplace API with error handling
export const marketplaceAPI = {
  getProducts: async (params = {}) => {
    try {
      console.log('🛒 Getting products with params:', params);
      const response = await api.get('/marketplace/products', { params });
      console.log('✅ Products response:', response);
      
      // ULTRA-SAFE: Validate response structure
      if (!response || !response.data) {
        console.log('⚠️ Empty response from products API');
        return { success: true, products: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 } };
      }
      
      // Handle different response structures
      if (response.data.success === true && Array.isArray(response.data.products)) {
        return response.data;
      } else if (Array.isArray(response.data)) {
        return { success: true, products: response.data, pagination: { page: 1, limit: response.data.length, total: response.data.length, pages: 1 } };
      } else if (response.data.products && Array.isArray(response.data.products)) {
        return { success: true, products: response.data.products, pagination: response.data.pagination || { page: 1, limit: response.data.products.length, total: response.data.products.length, pages: 1 } };
      } else {
        console.log('⚠️ Unexpected response structure:', response.data);
        return { success: true, products: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 } };
      }
    } catch (error) {
      console.error('❌ Error in marketplaceAPI.getProducts:', error);
      // ULTRA-SAFE: Always return a valid structure
      return { success: true, products: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 }, error: error.message };
    }
  },
  
  getProduct: async (id) => {
    try {
      console.log('🔍 Getting product with ID:', id);
      const response = await api.get(`/marketplace/products/${id}`);
      console.log('✅ Product response:', response);
      
      // ULTRA-SAFE: Validate response structure
      if (!response || !response.data) {
        console.log('⚠️ Empty response from product API');
        throw new Error('Product not found');
      }
      
      // Handle different response structures
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Product not found');
      }
      
      if (response.data.success === true && response.data.product) {
        return response;
      } else if (response.data._id) {
        // Direct product object
        return { data: { success: true, product: response.data } };
      } else {
        console.log('⚠️ Unexpected response structure:', response.data);
        throw new Error('Invalid product data structure');
      }
    } catch (error) {
      console.error('❌ Error in marketplaceAPI.getProduct:', error);
      throw error; // Re-throw the error so it can be handled by the calling component
    }
  },
  searchProducts: (query) => api.get(`/marketplace/products/search?q=${query}`),
  getFeaturedProducts: () => api.get('/marketplace/products/featured'),
  getProductsByCategory: (category) => api.get(`/marketplace/products/category/${category}`),
  getCart: () => api.get('/marketplace/cart'),
  addToCart: (productId, quantity) => api.post('/marketplace/cart/add', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/marketplace/cart/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/marketplace/cart/remove/${itemId}`),
  clearCart: () => api.delete('/marketplace/cart/clear'),
  createOrder: (orderData) => api.post('/marketplace/orders', orderData),
  getUserOrders: () => api.get('/marketplace/orders'),
  getOrderById: (id) => api.get(`/marketplace/orders/${id}`),
  cancelOrder: (id) => api.put(`/marketplace/orders/${id}/cancel`)
};

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