import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { toastWithInterval } from '../../utils/toast';

const useBookmarksQuery = () => {
  const { api } = useAuthStore();
  const queryClient = useQueryClient();
  const bookmarkBlog = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { blogPostId: string }
  >({
    mutationFn: async ({ blogPostId }) =>
      await api.post(`/blogs/${blogPostId}/bookmark`),
    onSuccess: ({ data: { result } }) => {
      toast.success(result);
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const removeBookmark = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { blogPostId: string }
  >({
    mutationFn: async ({ blogPostId }) =>
      await api.post(`/blogs/${blogPostId}/remove-bookmark`),
    onSuccess: ({ data: { result } }) => {
      toast.success(result);
      queryClient.invalidateQueries({
        queryKey: ['blogs'],
      });
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  return {
    bookmarkBlog,
    removeBookmark,
  };
};

export default useBookmarksQuery;
