import { create } from 'zustand';
import type { AuthState, User } from '../types/auth.types';
import { authApi } from '../api/authApi';

interface AuthActions {
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
  setMockMode: (enabled: boolean) => void;
  clearError: () => void;
}

const STORAGE_KEY_TOKEN = 'preproute_auth_token';
const STORAGE_KEY_USER = 'preproute_auth_user';
const STORAGE_KEY_MOCK = 'preproute_auth_mock_mode';

const initialToken = localStorage.getItem(STORAGE_KEY_TOKEN);
const initialUserStr = localStorage.getItem(STORAGE_KEY_USER);
const initialMockStr = localStorage.getItem(STORAGE_KEY_MOCK);

const initialUser: User | null = initialUserStr ? JSON.parse(initialUserStr) : null;
const isMockInitial = initialMockStr === 'true';

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
  isMockMode: isMockInitial,

  setMockMode: (enabled) => {
    localStorage.setItem(STORAGE_KEY_MOCK, String(enabled));
    set({ isMockMode: enabled });
  },

  clearError: () => set({ error: null }),

  login: async (userId, password) => {
    set({ isLoading: true, error: null });
    
    // If user has already explicitly forced mock mode
    if (get().isMockMode) {
      if (userId === 'vedant-admin' && password === 'vedant123') {
        const mockUser: User = {
          id: 'mock-admin-id',
          userId: 'vedant-admin',
          name: 'Vedant Admin (Mock)',
          role: 'admin',
          email: 'admin@preproute.com'
        };
        const mockToken = 'mock-jwt-token-12345';
        
        localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
        
        set({
          token: mockToken,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        set({
          error: 'Invalid mock credentials. Hint: use vedant-admin / vedant123',
          isLoading: false
        });
        return false;
      }
    }

    try {
      // Attempt API login
      const response = await authApi.login(userId, password);
      
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;

      if (token && user) {
        localStorage.setItem(STORAGE_KEY_TOKEN, token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          isMockMode: false
        });
        return true;
      } else {
        throw new Error('Invalid response payload from server');
      }
    } catch (err: any) {
      console.warn('API Authentication failed. Attempting mock fallback. Error:', err.message);
      
      // Fallback: If credentials match the test credentials, let them login in mock mode
      if (userId === 'vedant-admin' && password === 'vedant123') {
        const mockUser: User = {
          id: 'mock-admin-id',
          userId: 'vedant-admin',
          name: 'Vedant Admin (API Fallback)',
          role: 'admin',
          email: 'admin@preproute.com'
        };
        const mockToken = 'mock-jwt-token-12345';
        
        localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
        localStorage.setItem(STORAGE_KEY_MOCK, 'true');
        
        set({
          token: mockToken,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          isMockMode: true,
          error: 'Staging API failed/timed out. Logged in via Mock Mode.'
        });
        return true;
      }

      set({
        error: err.response?.data?.message || err.message || 'Authentication failed',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null
    });
  }
}));
