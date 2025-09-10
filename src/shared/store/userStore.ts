import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/entities/user/model/type';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setAuthenticated: (authenticated: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      setAuthenticated: (authenticated: boolean) =>
        set({ isAuthenticated: authenticated }),
    }),
    {
      name: 'user-storage',
    },
  ),
);
