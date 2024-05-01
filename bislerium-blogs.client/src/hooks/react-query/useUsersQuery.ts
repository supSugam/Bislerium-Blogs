import { useAuthStore } from '../../services/stores/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toastWithInterval } from '../../utils/toast';
const useUsersQuery = () => {
  const {
    api,

    isApiAuthorized,
  } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    console.log('isApiAuthorized', isApiAuthorized());
    console.log('api', api.defaults.headers);
  }, [api, isApiAuthorized]);

  const getMe = useQuery<
    AxiosResponse<ISuccessResponse<any>>,
    AxiosError<IFailedResponse>,
    void
  >({
    queryFn: async () => await api.get('/users/me'),
    queryKey: ['me'],
    enabled: isApiAuthorized(),
  });

  const deleteMe = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    void
  >({
    mutationFn: async () => await api.delete('/users/me'),
    onSuccess: () => {
      toast.success('Your account has been deleted successfully');
      navigate('/');
      window.location.reload();
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return { getMe, deleteMe };
};

export default useUsersQuery;
