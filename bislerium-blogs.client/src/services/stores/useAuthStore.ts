import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import { api } from '../../utils/constants';

interface AuthStore {
  api: AxiosInstance;
  setApi: (api: AxiosInstance) => void;
  isApiAuthorized: () => boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthStore>(
  (set, get): AuthStore => ({
    isApiAuthorized: () => !!get().api.defaults.headers?.['Authorization'],
    api,
    setApi: (api) => {
      set(() => ({ api }));
    },
    authModalOpen: false,
    openAuthModal: () => {
      set(() => ({ authModalOpen: true }));
    },
    closeAuthModal: () => {
      set(() => ({ authModalOpen: false }));
    },
  })
);
