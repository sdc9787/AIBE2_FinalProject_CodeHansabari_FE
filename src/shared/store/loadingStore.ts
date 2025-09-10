import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: '로딩 중...',
  setLoading: (isLoading: boolean, message = '로딩 중...') =>
    set({ isLoading, loadingMessage: message }),
}));
