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
import { IVotePayload } from '../../Interfaces/Models/IVotePayload';
import { keyFactory } from '../../utils/constants';
import {
  IBlogPaginatedResponse,
  IBlogPaginationDto,
} from '../../Interfaces/IPagination';

interface IUseBlogsQueryProps {
  getAllBlogsConfig?: {
    params?: IBlogPaginationDto;
    queryOptions?: Partial<
      UseQueryOptions<
        AxiosResponse<
          ISuccessResponse<IBlogPaginatedResponse>,
          IFailedResponse
        >,
        AxiosError<IFailedResponse>
      >
    >;
  };
  id?: string;
}
const useBlogsQuery = ({ getAllBlogsConfig, id }: IUseBlogsQueryProps) => {
  const { api } = useAuthStore();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const publishBlog = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    FormData
  >({
    mutationFn: async (data) =>
      await api.post(`/blogs`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: (data) => {
      toast.success('Blog Published, Redirecting...');
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
      navigate(`/blog/${data.data.result}`);
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const getBlogs = useQuery<
    AxiosResponse<ISuccessResponse<IBlogPaginatedResponse>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () =>
      await api.get('/blogs', { params: getAllBlogsConfig?.params }),
    queryKey: ['blogs', getAllBlogsConfig?.params],
    enabled: !!getAllBlogsConfig?.params,
    ...getAllBlogsConfig?.queryOptions,
  });

  const getBlogById = useQuery<
    AxiosResponse<ISuccessResponse<IBlog>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/${id}`),
    queryKey: ['blogs', id],
    retry: true,
    enabled: !!id,
  });

  const updateBlog = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { id: string; data: FormData }
  >({
    mutationFn: async ({ data, id }) =>
      await api.patch(`/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    onSuccess: () => {
      toast.success('Blog Updated, Redirecting...');
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
      navigate(`/blog/${id}`);
    },
    onError: (error) => {
      console.log(error);
      toastWithInterval({ error });
    },
  });

  const upvoteVlog = useMutation<
    AxiosResponse<ISuccessResponse<IVotePayload>>,
    AxiosError<IFailedResponse>,
    { id: string }
  >({
    mutationFn: async ({ id }) => await api.post(`/blogs/${id}/upvote`),
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const downvoteBlog = useMutation<
    AxiosResponse<ISuccessResponse<IVotePayload>>,
    AxiosError<IFailedResponse>,
    { id: string }
  >({
    mutationFn: async ({ id }) => await api.post(`/blogs/${id}/downvote`),
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const getBlogVotes = useQuery<
    AxiosResponse<ISuccessResponse<IVotePayload>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/${id}/reactions`),
    queryKey: [keyFactory.blogVotes],
    enabled: !!id,
  });

  const deleteBlog = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    string
  >({
    mutationFn: async (id) => await api.delete(`/blogs/${id}`),
    onSuccess: () => {
      toast.success('Blog Deleted');
      navigate('/');
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return {
    getBlogs,
    publishBlog,
    getBlogById,
    updateBlog,
    upvoteVlog,
    downvoteBlog,
    getBlogVotes,
    deleteBlog,
  };
};

export default useBlogsQuery;
