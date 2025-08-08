import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL); // <-- Add this line for debugging

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  sendEmailVerification: () => api.post('/auth/send-email-verification'),
  verifyEmail: (code) => api.post('/auth/verify-email', { code }),
  requestEmailChange: (newEmail) => api.post('/auth/request-email-change', { newEmail }),
  confirmEmailChange: (code) => api.post('/auth/confirm-email-change', { code }),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBestSellers: () => api.get('/products/best-sellers'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateToPaid: (id, paymentData) => api.put(`/orders/${id}/pay`, paymentData),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getAll: (params) => api.get('/orders', { params }), // Admin only
  deliver: (id) => api.put(`/orders/${id}/deliver`), // Admin only
};

// Payments API
export const paymentsAPI = {
  createOrder: (orderData) => api.post('/payments/create-order', orderData),
  verify: (verificationData) => api.post('/payments/verify', verificationData),
  getDetails: (paymentId) => api.get(`/payments/${paymentId}`),
  refund: (paymentId, refundData) => api.post(`/payments/${paymentId}/refund`, refundData),
  getRefunds: (paymentId) => api.get(`/payments/${paymentId}/refunds`),
  getMethods: () => api.get('/payments/methods'),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats/overview'),
};

// Offers API
export const offersAPI = {
  getCurrent: () => api.get('/offers/current'),
  getAll: () => api.get('/offers'),
  getById: (id) => api.get(`/offers/${id}`),
  create: (offerData) => api.post('/offers', offerData),
  update: (id, offerData) => api.put(`/offers/${id}`, offerData),
  delete: (id) => api.delete(`/offers/${id}`)
}; 