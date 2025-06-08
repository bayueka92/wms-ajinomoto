import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock data for demonstration
const mockUser: User = {
  id: '1',
  username: 'admin',
  name: 'Admin Utama',
  role: 'admin',
  email: 'admin@ajinomoto.co.id',
  lastLogin: new Date(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (username: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials against a backend
      if (username === 'admin' && password === 'admin') {
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false });
      console.error('Login error:', error);
      return false;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));