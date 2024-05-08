import { IBlog } from './Models/IBlog';

export enum SortBy {
  NEWEST,
  OLDEST,
  POPULARARITY,
  RANDOM,
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
  search?: string;
}

export interface IBlogPaginationDto extends IPagination {
  sortBy?: SortBy;
  ofThisSpecificMonth?: Date;
  tag?: string;
}

export interface IBlogPaginatedResponse {
  blogs: IBlog[];
  totalBlogs: number;
  currentPage: number;
}
