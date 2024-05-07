import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { ISuccessResponse } from '../../Interfaces/IApiResponse';
import { INotification } from '../../Interfaces/Models/INotification';
import { useAuthStore } from '../../services/stores/useAuthStore';

const useNotificationsQuery = () => {
  const queryClient = useQueryClient();

  const { api, isApiAuthorized } = useAuthStore();

  const getMyNotifications = useQuery<
    AxiosResponse<ISuccessResponse<INotification[]>>
  >({
    queryKey: ['notifications'],
    queryFn: async () => await api.get('/notifications'),
    // staleTime: 1000 * 10, // 10 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    // refetchInterval: 1000 * 10, // 10 seconds
    enabled: isApiAuthorized(),
  });
  // fomib53644@lewenbo.com Test@123
  const readAllNotifications = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    Error,
    void
  >({
    mutationFn: async () => await api.post('/notifications/read'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const readNotification = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    Error,
    string
  >({
    mutationFn: async (notificationId) =>
      await api.post(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadNotification = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    Error,
    string
  >({
    mutationFn: async (notificationId) =>
      await api.post(`/notifications/${notificationId}/unread`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    getMyNotifications,
    readAllNotifications,
    readNotification,
    unreadNotification,
  };
};

export default useNotificationsQuery;
