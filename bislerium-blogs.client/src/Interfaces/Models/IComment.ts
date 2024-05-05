import { IUser } from './IUser';

export interface IComment {
  commentId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: IUser;
  blogPostId: string;
  replies: IComment[];
  parentCommentId?: string | null;
  reactions: ICommentReactions;
  isEdited: boolean;
}

export interface ICommentReactions {
  popularity: number;
  isVotedUp: boolean;
  isVotedDown: boolean;
  totalReplies: number;
}
