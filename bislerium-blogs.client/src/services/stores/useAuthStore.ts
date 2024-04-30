import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import { api } from '../../utils/constants';
import { jwtDecode } from 'jwt-decode';

interface AuthSessionData {
  email?: string;
  fullName?: string;
}
type ActiveSection = 'signup' | 'login' | 'verify-otp';

interface AuthStore {
  api: AxiosInstance;
  setApi: (api: AxiosInstance) => void;
  isApiAuthorized: () => boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authModalActiveSection: ActiveSection;
  setAuthModalActiveSection: (section: ActiveSection) => void;
  onInitialize: () => void;
  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
  authSession: AuthSessionData;
  setAuthSession: (data: AuthSessionData) => void;
}

export const useAuthStore = create<AuthStore>(
  (set, get): AuthStore => ({
    authModalActiveSection: 'verify-otp',
    setAuthModalActiveSection: (section) => {
      set(() => ({ authModalActiveSection: section }));
    },
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
    onInitialize: () => {
      const { openAuthModal } = get();
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const expirationTime = (decodedToken?.exp || 0) * 1000;

        if (Date.now() >= expirationTime) {
          // Token has expired, clear localStorage
          localStorage.removeItem('accessToken');
          set(() => ({ api }));
          openAuthModal();
        } else {
          api.defaults.headers[
            'Authorization'
          ] = `Bearer ${localStorage.getItem('accessToken')}`;
        }
      }
    },
    updateAccessToken: (accessToken) => {
      api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      set(() => ({ api }));
    },
    authSession: {
      email: 'vafaxin655@buzblox.com',
      fullName: 'Bruh Moment',
    },
    setAuthSession: (data) => {
      const { authSession } = get();
      set(() => ({ authSession: { ...authSession, ...data } }));
    },
  })
);
