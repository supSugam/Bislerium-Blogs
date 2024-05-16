import { create } from 'zustand';
import { AxiosInstance } from 'axios';
import { api } from '../../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../../Interfaces/Models/IUser';
import toast from 'react-hot-toast';

interface AuthSessionData {
  email?: string;
  fullName?: string;
}

type PasswordSessionData = {
  email: string;
  password: string;
} | null;
type ActiveSection =
  | 'signup'
  | 'login'
  | 'verify-account'
  | 'update-profile'
  | 'reset-password'
  | 'verify-reset-password';

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
  passwordSession: PasswordSessionData;
  setPasswordSession: (data: PasswordSessionData) => void;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthStore>(
  (set, get): AuthStore => ({
    authModalActiveSection: 'login',
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
      set(() => ({
        authModalOpen: false,
        authModalActiveSection: 'login',
        authSession: {},
        passwordSession: null,
      }));
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
      localStorage.setItem('accessToken', accessToken);
    },
    logout: () => {
      localStorage.removeItem('accessToken');
      set(() => ({ api, currentUser: null, accessToken: null }));
      if (window.location.pathname !== '/') window.location.replace('/');
      window.location.reload();
      toast("Logged Out, You're now a Surfer 🏄‍♂️", { icon: '🏄‍♂️' });
    },
    authSession: {},
    setAuthSession: (data) => {
      const { authSession } = get();
      set(() => ({ authSession: { ...authSession, ...data } }));
    },
    passwordSession: null,
    setPasswordSession: (data) => {
      set(() => ({ passwordSession: data }));
    },
    currentUser: null,
    setCurrentUser: (user) => {
      set(() => ({ currentUser: user }));
    },
  })
);
