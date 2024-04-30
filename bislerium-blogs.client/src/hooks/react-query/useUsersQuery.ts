import { useAuthStore } from '../../services/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { useEffect } from 'react';
const useUsersQuery = () => {
  const {
    api,

    isApiAuthorized,
  } = useAuthStore();

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

  return { getMe };
};

export default useUsersQuery;
