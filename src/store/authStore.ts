import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: 'ar' | 'fr';
  setUser: (user: UserProfile | null) => void;
  setLanguage: (language: 'ar' | 'fr') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' 
    ? (JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user || null)
    : null,
  isAuthenticated: typeof window !== 'undefined'
    ? (JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.isAuthenticated || false)
    : false,
  language: typeof window !== 'undefined'
    ? (JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.language || 'ar')
    : 'ar',
  setUser: (user) => {
    const state = { user, isAuthenticated: !!user };
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-storage', JSON.stringify({ state }));
    }
    set(state);
  },
  setLanguage: (language) => {
    const state = { language };
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      localStorage.setItem('auth-storage', JSON.stringify({ 
        ...existing, 
        state: { ...existing.state, language } 
      }));
    }
    set(state);
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }
    set({ user: null, isAuthenticated: false });
  },
}));
