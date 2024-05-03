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
import { useNavigate } from 'react-router-dom';

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
  id?: string;
}
const useBlogsQuery = ({ getAllBlogsConfig, id }: IUseBlogsQueryProps) => {
  const { api, isApiAuthorized } = useAuthStore();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      navigate(`/blogs/${data.data.result}`);
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

  const getBlogById = useQuery<
    AxiosResponse<ISuccessResponse<IBlog>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/${id}`),
    queryKey: ['blogs', id],
    enabled: typeof id === 'string',
  });
  return { getBlogs, publishBlog, getBlogById };
};

export default useBlogsQuery;
