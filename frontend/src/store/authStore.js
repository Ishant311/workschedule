import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  LoadingAuthUser: true,
  fetchAuthUser: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ authUser: res.data });
    } catch (err) {
      console.error('Auth fetch failed', err);
      set({ authUser: null });
    } finally {
      set({ LoadingAuthUser: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    }
    set({ authUser: null });
  }
}));
