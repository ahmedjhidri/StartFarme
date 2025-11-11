import axios from 'axios';
import type { UserProfile, WeatherData, Crop, MarketPrice, Listing } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock mode - set to false when backend is ready
// ✅ Backend is ready and configured!
// Backend API is available at http://localhost:3000/api
const MOCK_MODE = false; // ✅ Using real backend API

// Auth API
export const authAPI = {
  sendOTP: async (phone: string) => {
    if (MOCK_MODE) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'OTP sent' };
    }
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },
  verifyOTP: async (phone: string, code: string) => {
    if (MOCK_MODE) {
      // Simulate API call - accept any 6-digit code for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (code.length === 6) {
        return { success: true, token: 'mock_token', user: null };
      }
      throw new Error('Invalid OTP code');
    }
    const response = await api.post('/auth/verify-otp', { phone, code });
    return response.data;
  },
  getProfile: async (): Promise<UserProfile> => {
    if (MOCK_MODE) {
      const stored = localStorage.getItem('user');
      if (stored) {
        return JSON.parse(stored);
      }
      throw new Error('User not found');
    }
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    if (MOCK_MODE) {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : {};
      const updated = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
    const response = await api.put('/auth/me', data);
    return response.data;
  },
};

// Weather API
export const weatherAPI = {
  getCurrent: async (lat: number, lng: number): Promise<WeatherData> => {
    if (MOCK_MODE) {
      // Return mock weather data
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        location: 'Tunis',
        current: {
          temp: 22,
          humidity: 65,
          rainfall: 0,
          windSpeed: 15,
          condition: 'Sunny',
          conditionAr: 'مشمس',
        },
        forecast: [],
      };
    }
    const response = await api.get(`/weather/current?lat=${lat}&lng=${lng}`);
    return response.data;
  },
  getForecast: async (lat: number, lng: number, days: number = 7): Promise<WeatherData> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        location: 'Tunis',
        current: {
          temp: 22,
          humidity: 65,
          rainfall: 0,
          windSpeed: 15,
          condition: 'Sunny',
          conditionAr: 'مشمس',
        },
        forecast: [],
      };
    }
    const response = await api.get(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`);
    return response.data;
  },
  getAlerts: async (governorate: string) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return []; // No alerts in mock mode
    }
    const response = await api.get(`/weather/alerts?governorate=${governorate}`);
    return response.data;
  },
};

// Crops API
export const cropsAPI = {
  getAll: async (): Promise<Crop[]> => {
    if (MOCK_MODE) {
      const stored = localStorage.getItem('crops');
      return stored ? JSON.parse(stored) : [];
    }
    const response = await api.get('/crops');
    return response.data;
  },
  create: async (data: Omit<Crop, 'id' | 'farmerId'>): Promise<Crop> => {
    if (MOCK_MODE) {
      const crops = await cropsAPI.getAll();
      const newCrop: Crop = {
        ...data,
        id: Date.now().toString(),
        farmerId: '1', // Mock farmer ID
      };
      crops.push(newCrop);
      localStorage.setItem('crops', JSON.stringify(crops));
      return newCrop;
    }
    const response = await api.post('/crops', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Crop>): Promise<Crop> => {
    if (MOCK_MODE) {
      const crops = await cropsAPI.getAll();
      const index = crops.findIndex(c => c.id === id);
      if (index !== -1) {
        crops[index] = { ...crops[index], ...data };
        localStorage.setItem('crops', JSON.stringify(crops));
        return crops[index];
      }
      throw new Error('Crop not found');
    }
    const response = await api.put(`/crops/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    if (MOCK_MODE) {
      const crops = await cropsAPI.getAll();
      const filtered = crops.filter(c => c.id !== id);
      localStorage.setItem('crops', JSON.stringify(filtered));
      return;
    }
    await api.delete(`/crops/${id}`);
  },
  getCalendar: async (crop: string, region: string) => {
    if (MOCK_MODE) {
      return { crop, region, tasks: [] };
    }
    const response = await api.get(`/crops/calendar?crop=${crop}&region=${region}`);
    return response.data;
  },
};

// Market API
export const marketAPI = {
  getPrices: async (product?: string): Promise<MarketPrice[]> => {
    if (MOCK_MODE) {
      return [];
    }
    const response = await api.get('/market/prices', { params: { product } });
    return response.data;
  },
  getPriceHistory: async (product: string, days: number = 30) => {
    if (MOCK_MODE) {
      return [];
    }
    const response = await api.get(`/market/prices/history?product=${product}&days=${days}`);
    return response.data;
  },
  getListings: async (filters?: any): Promise<Listing[]> => {
    if (MOCK_MODE) {
      return [];
    }
    const response = await api.get('/listings', { params: filters });
    return response.data;
  },
  createListing: async (data: Omit<Listing, 'id' | 'farmerId' | 'createdAt'>): Promise<Listing> => {
    if (MOCK_MODE) {
      const listing: Listing = {
        ...data,
        id: Date.now().toString(),
        farmerId: '1',
        createdAt: new Date(),
      };
      return listing;
    }
    const response = await api.post('/listings', data);
    return response.data;
  },
  updateListing: async (id: string, data: Partial<Listing>): Promise<Listing> => {
    if (MOCK_MODE) {
      throw new Error('Not implemented in mock mode');
    }
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },
  deleteListing: async (id: string): Promise<void> => {
    if (MOCK_MODE) {
      return;
    }
    await api.delete(`/listings/${id}`);
  },
};

export default api;
