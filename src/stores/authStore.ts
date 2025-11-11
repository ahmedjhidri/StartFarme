import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'ar' | 'fr';
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: 'ar' | 'fr') => void;
  logout: () => void;
}

// Load language from localStorage on init
const getStoredLanguage = (): 'ar' | 'fr' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language');
    if (stored === 'ar' || stored === 'fr') {
      return stored;
    }
  }
  return 'ar';
};

// Initialize language direction
const initLanguage = () => {
  const lang = getStoredLanguage();
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
  return lang;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  language: initLanguage(),
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_token', 'mock_token'); // Replace with actual token
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  },
  setLanguage: (lang) => {
    set({ language: lang });
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  },
}));

