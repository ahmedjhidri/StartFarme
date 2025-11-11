import axios from 'axios';

// API base URL - will be set from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.user?.id) {
        config.headers.Authorization = `Bearer ${state.user.id}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  sendOTP: (phone: string) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp }),
  getProfile: () => api.get('/auth/me'),
};

export const weatherAPI = {
  getCurrent: (lat: number, lng: number) => api.get(`/weather/current?lat=${lat}&lng=${lng}`),
  getForecast: (lat: number, lng: number, days: number = 7) => 
    api.get(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`),
  getAlerts: (governorate: string) => api.get(`/weather/alerts?governorate=${governorate}`),
};

export const cropsAPI = {
  getCrops: () => api.get('/crops'),
  createCrop: (data: any) => api.post('/crops', data),
  updateCrop: (id: string, data: any) => api.put(`/crops/${id}`, data),
  deleteCrop: (id: string) => api.delete(`/crops/${id}`),
  getCalendar: (crop: string, region: string) => 
    api.get(`/crops/calendar?crop=${crop}&region=${region}`),
};

export const marketAPI = {
  getPrices: (product?: string) => 
    api.get(`/market/prices${product ? `?product=${product}` : ''}`),
  getPriceHistory: (product: string, days: number = 30) => 
    api.get(`/market/prices/history?product=${product}&days=${days}`),
  getListings: (filters?: any) => api.get('/listings', { params: filters }),
  createListing: (data: any) => api.post('/listings', data),
  updateListing: (id: string, data: any) => api.put(`/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),
};

export const irrigationAPI = {
  calculate: (data: any) => api.post('/irrigation/calculate', data),
  getHistory: () => api.get('/irrigation/history'),
  log: (data: any) => api.post('/irrigation/log', data),
};

export const pestDetectionAPI = {
  detect: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post('/pest-detection', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getHistory: () => api.get('/pest-detection/history'),
};

export const forumAPI = {
  getPosts: (filters?: any) => api.get('/forum/posts', { params: filters }),
  createPost: (data: any) => api.post('/forum/posts', data),
  addReply: (postId: string, data: any) => api.post(`/forum/posts/${postId}/replies`, data),
  upvotePost: (postId: string) => api.put(`/forum/posts/${postId}/upvote`),
};

