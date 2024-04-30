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
  const { api, updateAccessToken, closeAuthModal } = useAuthStore();

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
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const logIn = useMutation<
    AxiosResponse<ISuccessResponse<{ accessToken: string }>>,
    AxiosError<IFailedResponse>,
    { email: string; password: string }
  >({
    mutationFn: async (data) => await api.post('/auth/login', data),
    onSuccess: (data) => {
      toast.success('Logged in successfully');
      updateAccessToken(data.data.result.accessToken);
      closeAuthModal();
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
      toast.success(data.data.result);
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const resendOtp = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { email: string; fullName: string },
    string
  >({
    mutationFn: async (data) => await api.post('/auth/resend-otp', data),
    onSuccess: (data) => {
      toast.success(data.data.result);
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return { signUp, verifyOtp, logIn, resendOtp };
};

export default useAuthQuery;
