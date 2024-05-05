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
import { IComment, ICommentReactions } from '../../Interfaces/Models/IComment';
import { keyFactory } from '../../utils/constants';
import { useCommentsStore } from '../../services/stores/useCommentsStore';

interface ICommentsQueryParams {
  includeReplies?: boolean;
}
interface IUseCommentsQueryProps {
  getAllCommentsConfig?: {
    blogPostId?: string;
    params?: ICommentsQueryParams;
    queryOptions?: Partial<
      UseQueryOptions<
        AxiosResponse<ISuccessResponse<IComment[]>, IFailedResponse>,
        AxiosError<IFailedResponse>
      >
    >;
  };
  id?: string;
}
const useCommentsQuery = ({
  getAllCommentsConfig,
  id,
}: IUseCommentsQueryProps) => {
  const { api } = useAuthStore();
  const { addCommentToBlog, replaceCommentOnBlog, deleteCommentFromBlog } =
    useCommentsStore();

  const queryClient = useQueryClient();

  const publishComment = useMutation<
    AxiosResponse<ISuccessResponse<IComment>>,
    AxiosError<IFailedResponse>,
    { body: string; blogPostId: string; parentCommentId: string | null }
  >({
    mutationFn: async (data) => await api.post(`/comments`, data),
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [keyFactory.blogVotes],
      });
      queryClient.refetchQueries({
        queryKey: [keyFactory.commentReactions],
      });
      const newComment = data.data.result;
      if (newComment) {
        addCommentToBlog(
          newComment.blogPostId,
          newComment,
          newComment.parentCommentId
        );
      }
    },
    onError: (error) => {
      toastWithInterval({ error });
    },
    onSettled: (data, error) => {},
  });

  const getComments = useQuery<
    AxiosResponse<ISuccessResponse<IComment[]>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () =>
      await api.get(`/comments/${getAllCommentsConfig?.blogPostId}`, {
        params: getAllCommentsConfig?.params,
      }),
    queryKey: ['comments', getAllCommentsConfig?.params],
    enabled: !!getAllCommentsConfig?.blogPostId,
    ...getAllCommentsConfig?.queryOptions,
  });

  const getCommentById = useQuery<
    AxiosResponse<ISuccessResponse<IComment>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/comments/${id}`),
    queryKey: ['comments', id],
    enabled: typeof id === 'string',
  });

  const updateComment = useMutation<
    AxiosResponse<ISuccessResponse<IComment>>,
    AxiosError<IFailedResponse>,
    { id: string; body: string }
  >({
    mutationFn: async ({ body, id }) =>
      await api.patch(`/comments/${id}`, { body }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });

      const updatedComment = data.data.result;
      if (updatedComment) {
        replaceCommentOnBlog(
          updatedComment.blogPostId,
          updatedComment.commentId,
          updatedComment
        );
      }
    },
    onError: (error) => {
      console.log(error);
      toastWithInterval({ error });
    },
  });

  const upvoteComment = useMutation<
    AxiosResponse<ISuccessResponse<ICommentReactions>>,
    AxiosError<IFailedResponse>,
    { id: string }
  >({
    mutationFn: async ({ id }) => await api.post(`/comments/${id}/upvote`),
    onError: (error) => {
      toastWithInterval({ error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [keyFactory.commentReactions],
      });
    },
  });

  const downvoteComment = useMutation<
    AxiosResponse<ISuccessResponse<ICommentReactions>>,
    AxiosError<IFailedResponse>,
    { id: string }
  >({
    mutationFn: async ({ id }) => await api.post(`/comments/${id}/downvote`),
    onError: (error) => {
      toastWithInterval({ error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [keyFactory.commentReactions],
      });
    },
  });

  const getCommentReactions = useQuery<
    AxiosResponse<ISuccessResponse<ICommentReactions>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/comments/${id}/reactions`),
    queryKey: [keyFactory.commentReactions],
    enabled: typeof id === 'string',
  });

  const deleteComment = useMutation<
    AxiosResponse<ISuccessResponse<IComment>>,
    AxiosError<IFailedResponse>,
    { id: string }
  >({
    mutationFn: async ({ id }) => await api.delete(`/comments/${id}`),
    onError: (error) => {
      toastWithInterval({ error });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      const deletedComment = data.data.result;
      if (deletedComment) {
        deleteCommentFromBlog(
          deletedComment.blogPostId,
          deletedComment.commentId
        );
      }
    },
  });

  return {
    getComments,
    publishComment,
    getCommentById,
    updateComment,
    upvoteComment,
    downvoteComment,
    getCommentReactions,
    deleteComment,
  };
};

export default useCommentsQuery;
