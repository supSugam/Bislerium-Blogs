import { ITag } from './ITag';
import { IUser } from './IUser';
import { IVotePayload } from './IVotePayload';

export interface IBlog {
  blogPostId: string;
  title: string;
  body: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
  popularity: number;
  tags: ITag[];
  votePayload: IVotePayload;
}

export interface IBlogHistoryPreview {
  blogPostHistoryId: string;
  blogPostId: string;
  title: string;
  thumbnail: string;
  changesSummary: string;
  updatedAt: Date;
}

export interface IBlogHistory extends IBlogHistoryPreview {
  body: string;
  tags: ITag[];
  author: IUser;
}
