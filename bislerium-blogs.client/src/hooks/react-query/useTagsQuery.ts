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
import { ITag } from '../../Interfaces/Models/ITag';

interface ITagsQueryParams {
  search?: string;
}
interface IUseTagsQueryProps {
  getAllTagsConfig?: {
    params?: ITagsQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<
        AxiosResponse<ISuccessResponse<ITag[]>, IFailedResponse>,
        AxiosError<IFailedResponse>
      >
    >;
  };
}
const useTagsQuery = ({ getAllTagsConfig }: IUseTagsQueryProps) => {
  const { api, isApiAuthorized } = useAuthStore();

  const queryClient = useQueryClient();

  const createTag = useMutation<
    AxiosResponse<ISuccessResponse<string>>,
    AxiosError<IFailedResponse>,
    { name: string }
  >({
    mutationFn: async (data) => await api.post(`/tags/${data.name}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
  });

  const getTags = useQuery<
    AxiosResponse<ISuccessResponse<ITag[]>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get('/tags'),
    queryKey: ['tags'],
    enabled: isApiAuthorized(),
    ...getAllTagsConfig?.queryOptions,
  });

  return { getTags, createTag };
};

export default useTagsQuery;
