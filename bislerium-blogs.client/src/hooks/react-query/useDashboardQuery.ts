import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { UserRole } from '../../enums/UserRole';
import { IDashboardStats, ITop10Stats } from '../../Interfaces/IDashboard';

interface IUseDashboardQueryProps {
  statsOfThisSpecificMonth?: Date;
  top10StatsOfThisSpecificMonth?: Date;
}

const useDashboardQuery = ({
  statsOfThisSpecificMonth,
  top10StatsOfThisSpecificMonth,
}: IUseDashboardQueryProps) => {
  const { api, isApiAuthorized } = useAuthStore();

  const getDashboardStats = useQuery<
    AxiosResponse<ISuccessResponse<IDashboardStats>>,
    IFailedResponse
  >({
    queryKey: ['dashboard-main', statsOfThisSpecificMonth],
    queryFn: async () =>
      await api.get('/dashboard', {
        params: { ofThisSpecificMonth: statsOfThisSpecificMonth },
      }),
    enabled: isApiAuthorized(),
    refetchOnWindowFocus: true,
  });

  const getTop10Stats = useQuery<AxiosResponse<ISuccessResponse<ITop10Stats>>>({
    queryKey: ['dashboard-top', top10StatsOfThisSpecificMonth],
    queryFn: async () =>
      await api.get('/dashboard/top-10', {
        params: { ofThisSpecificMonth: top10StatsOfThisSpecificMonth },
      }),
    enabled: isApiAuthorized(),
    refetchOnWindowFocus: true,
  });

  return {
    getDashboardStats,
    getTop10Stats,
  };
};

export default useDashboardQuery;
