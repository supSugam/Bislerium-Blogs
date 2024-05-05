import { create } from 'zustand';
import { IComment } from '../../Interfaces/Models/IComment';

interface CommentsStore {
  comments: Record<string, IComment[]>;
  setComments: (blogId: string, comments: IComment[]) => void;
  replaceCommentOnBlog: (
    blogId: string,
    commentId: string,
    comment: IComment
  ) => void;
  addCommentToBlog: (
    blogId: string,
    commentToAdd: IComment,
    parentCommentId?: string | null
  ) => void;
  deleteCommentFromBlog: (blogId: string, commentId: string) => void;
  doesCommentExist: (blogId: string, commentId: string) => boolean;
  getCommentsCount: (blogId?: string, includeReplies?: boolean) => number;
}

const replaceCommentRecursive = (
  comments: IComment[],
  commentId: string,
  newComment: IComment
): IComment[] => {
  return comments.map((comment) => {
    if (comment.commentId === commentId) {
      return {
        ...newComment,
        replies: replaceCommentRecursive(
          comment.replies,
          commentId,
          newComment
        ),
      };
    }
    return {
      ...comment,
      replies: replaceCommentRecursive(comment.replies, commentId, newComment),
    };
  });
};

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  comments: {},
  setComments: (blogId, comments) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [blogId]: comments,
      },
    }));
  },
  replaceCommentOnBlog: (blogId, commentId, comment) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [blogId]: replaceCommentRecursive(
          state.comments[blogId],
          commentId,
          comment
        ),
      },
    }));
  },
  deleteCommentFromBlog: (blogId, commentId) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [blogId]: state.comments[blogId].flatMap((comment) =>
          comment.commentId === commentId
            ? comment.replies
            : [
                comment,
                ...comment.replies.filter(
                  (reply) => reply.commentId !== commentId
                ),
              ]
        ),
      },
    }));
  },
  doesCommentExist: (blogId, commentId) => {
    const comments = get().comments[blogId];
    return comments.some(
      (comment) =>
        comment.commentId === commentId ||
        comment.replies.some((reply) => reply.commentId === commentId)
    );
  },
  getCommentsCount: (blogId, includeReplies = false) => {
    if (!blogId) return 0;
    const comments = get().comments[blogId];
    if (!comments) return 0;

    const countReplies = (comment: IComment): number => {
      let count = 1; // Include the comment itself
      if (includeReplies) {
        count += comment.replies.reduce(
          (total, reply) => total + countReplies(reply),
          0
        );
      }
      return count;
    };

    return comments.reduce(
      (total, comment) => total + countReplies(comment),
      0
    );
  },

  addCommentToBlog: (blogId, commentToAdd, parentCommentId = null) => {
    set((state) => {
      const comments = state.comments[blogId] || [];

      if (parentCommentId === null) {
        return {
          comments: {
            ...state.comments,
            [blogId]: [...comments, commentToAdd],
          },
        };
      }

      const newComments = comments.map((comment) => {
        if (comment.commentId === parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, commentToAdd],
          };
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.commentId === parentCommentId) {
              return {
                ...reply,
                replies: [...reply.replies, commentToAdd],
              };
            }
            return reply;
          }),
        };
      });

      return {
        comments: {
          ...state.comments,
          [blogId]: newComments,
        },
      };
    });
  },
}));
