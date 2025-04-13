import { create } from 'zustand';
import { User } from 'firebase/auth';
import * as authService from '../lib/auth';
import { AuthError } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ initialized }),

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error as AuthError, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signUp(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error as AuthError, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error as AuthError, loading: false });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ loading: false });
    } catch (error) {
      set({ error: error as AuthError, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 