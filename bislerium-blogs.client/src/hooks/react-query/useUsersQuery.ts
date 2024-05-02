import { useAuthStore } from '../../services/stores/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toastWithInterval } from '../../utils/toast';
import { IUser } from '../../Interfaces/Models/IUser';
const useUsersQuery = () => {
  const { api, isApiAuthorized, setCurrentUser, closeAuthModal } =
    useAuthStore();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getMe = useQuery<
    AxiosResponse<ISuccessResponse<IUser>>,
    AxiosError<IFailedResponse>
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

  const updateMe = useMutation<
    AxiosResponse<ISuccessResponse<IUser>>,
    AxiosError<IFailedResponse>,
    FormData
  >({
    mutationFn: async (data) =>
      await api.patch('/users/me', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: (data) => {
      setCurrentUser(data.data.result);
      toast.success('Profile Updated');
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
      closeAuthModal();
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return { getMe, deleteMe, updateMe };
};

export default useUsersQuery;
