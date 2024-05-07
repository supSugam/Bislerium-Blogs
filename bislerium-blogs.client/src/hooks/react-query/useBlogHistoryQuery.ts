import { useQuery } from '@tanstack/react-query';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { AxiosError, AxiosResponse } from 'axios';
import {
  IBlogHistory,
  IBlogHistoryPreview,
} from '../../Interfaces/Models/IBlog';

interface IUseBlogHistoryQuery {
  blogHistoryId?: string;
  blogPostId?: string;
}
const useBlogHistoryQuery = ({
  blogPostId,
  blogHistoryId,
}: IUseBlogHistoryQuery) => {
  const { api } = useAuthStore();

  const getBlogHistoryById = useQuery<
    AxiosResponse<ISuccessResponse<IBlogHistory>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/${blogHistoryId}/history`),
    queryKey: ['blogs', blogHistoryId, 'history'],
    enabled: !!blogHistoryId,
  });

  const getBlogHistoryPreviewById = useQuery<
    AxiosResponse<ISuccessResponse<IBlogHistoryPreview[]>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/${blogPostId}/history`),
    queryKey: ['blogs', blogPostId, 'history'],
    enabled: !!blogPostId,
  });

  return {
    getBlogHistoryById,
    getBlogHistoryPreviewById,
  };
};

export default useBlogHistoryQuery;
