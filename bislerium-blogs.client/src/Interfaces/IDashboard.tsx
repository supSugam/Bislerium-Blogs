import { IBlog } from './Models/IBlog';
import { IUser } from './Models/IUser';

export interface IDashboardStats {
  totalBloggers: number;
  totalBlogs: number;
  totalBookmarks: number;
  totalComments: number;
  totalUpvotesOnBlog: number;
  totalDownvotesOnBlog: number;
  totalUpvotesOnComment: number;
  totalDownvotesOnComment: number;
  mostPopularBlog: IBlog | null;
}

export interface ITop10Stats {
  top10Blogs: IBlog[];
  top10Bloggers: IUser[];
}
