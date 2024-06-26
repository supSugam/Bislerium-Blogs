import { useAuthStore } from '../../services/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import toast from 'react-hot-toast';
import { toastWithInterval } from '../../utils/toast';
const useAuthQuery = () => {
  const {
    api,
    updateAccessToken,
    closeAuthModal,
    setAuthModalActiveSection,
    setAuthSession,
    logout,
  } = useAuthStore();

  // Sign Up

  const signUp = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    FormData
  >({
    mutationFn: async (data: FormData) =>
      await api.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: (data) => {
      toast.success(data.data.result);
      setAuthModalActiveSection('verify-account');
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const logIn = useMutation<
    AxiosResponse<
      ISuccessResponse<{
        accessToken: string | null;
        isEmailConfirmed: boolean;
        email: string;
        username: string;
      }>
    >,
    AxiosError<IFailedResponse>,
    { email: string; password: string }
  >({
    mutationFn: async (data) => await api.post('/auth/login', data),
    onSuccess: (data) => {
      if (data.data.result.isEmailConfirmed && data.data.result.accessToken) {
        updateAccessToken(data.data.result.accessToken);
        toast.success('Logged in successfully');
        closeAuthModal();
      } else {
        toast.error('Please verify your email first');
        setAuthSession({
          email: data.data.result.email,
          fullName: data.data.result.username,
        });
        setAuthModalActiveSection('verify-account');
      }
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  // OTP

  const verifyOtp = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { otp: number; email: string },
    string
  >({
    mutationFn: async (data) => await api.post('/auth/verify-otp', data),
    onSuccess: (data) => {
      toast.success('Account Verified, You may login now.');
      setAuthModalActiveSection('login');
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const sendOtp = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { email: string; fullName: string; subject: string | null },
    string
  >({
    mutationFn: async (data) => await api.post('/auth/send-otp', data),
    onSuccess: (data) => {
      toast.success(data.data.result);
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const resetPassword = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { email: string; password: string; otp: number },
    string
  >({
    mutationFn: async (data) => await api.post('/auth/reset-password', data),
    onSuccess: (data) => {
      toast.success(data.data.result);
      logout();
      setAuthModalActiveSection('login');
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return { signUp, verifyOtp, logIn, sendOtp, resetPassword };
};

export default useAuthQuery;
