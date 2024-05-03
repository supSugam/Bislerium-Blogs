import { useAuthStore } from '../../services/stores/useAuthStore';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { toastWithInterval } from '../../utils/toast';
import { IBlog } from '../../Interfaces/Models/IBlog';
import toast from 'react-hot-toast';

interface IBlogsQueryParams {
  search?: string;
}
interface IUseBlogsQueryProps {
  getAllBlogsConfig?: {
    params?: IBlogsQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<
        AxiosResponse<ISuccessResponse<IBlog[]>, IFailedResponse>,
        AxiosError<IFailedResponse>
      >
    >;
  };
}
const useBlogsQuery = ({ getAllBlogsConfig }: IUseBlogsQueryProps) => {
  const { api, isApiAuthorized } = useAuthStore();

  const queryClient = useQueryClient();

  const publishBlog = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    FormData
  >({
    mutationFn: async (data) => await api.post(`/blogs`, data),
    onSuccess: (data) => {
      toast.success(data.data.result ?? 'Blog Published, Redirecting...');
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const getBlogs = useQuery<
    AxiosResponse<ISuccessResponse<IBlog[]>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () =>
      await api.get('/blogs', { params: getAllBlogsConfig?.params }),
    queryKey: ['blogs', getAllBlogsConfig?.params],
    enabled: isApiAuthorized(),
    ...getAllBlogsConfig?.queryOptions,
  });

  return { getBlogs, publishBlog };
};

export default useBlogsQuery;
