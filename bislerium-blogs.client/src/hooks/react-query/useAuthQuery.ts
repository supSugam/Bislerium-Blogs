import React from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import toast from 'react-hot-toast';
import { toastWithInterval } from '../../utils/toast';
const useAuthQuery = () => {
  const { api } = useAuthStore();

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

  return { signUp };
};

export default useAuthQuery;
