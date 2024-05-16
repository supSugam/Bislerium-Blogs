import { useState } from 'react';
import { IBlog } from '../Interfaces/Models/IBlog';
import {
  estimateReadingTime,
  htmlToText,
  whenDidItHappen,
} from '../utils/string';
import { Capsule } from './Elements/MultiSelect';
import Bookmark from './Bookmark';
import Vote from './Vote';
import CommentIcon from './Smol/CommentIcon';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import BlogOptions from './Smol/BlogOptions';

interface IBlogCardProps {
  blog: IBlog;
  className?: string;
}
const BlogCard = ({ blog, className }: IBlogCardProps) => {
  const [imageSource, setImageSource] = useState<string>(
    blog.thumbnail ?? 'https://source.unsplash.com/random'
  );
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'flex justify-between gap-x-14 items-center border-b border-neutral-200 cursor-pointer',
        className
      )}
    >
      <div className="flex flex-col gap-y-3">
        <Link
          to={`/profile/${blog.author.username}`}
          className="flex gap-x-1 items-center"
        >
          <img
            src={blog.author.avatarUrl ?? 'https://source.unsplash.com/random'}
            className="w-6 h-6 rounded-full"
            alt="User Image"
          />
          <span className="text-sm line-clamp-1 ml-1">
            {blog.author.fullName}
          </span>
          &middot;
          <span className="text-sm text-neutral-500">
            {whenDidItHappen(blog.createdAt)}
          </span>
        </Link>

        <Link to={`/blog/${blog.blogPostId}`} className="flex flex-col gap-y-3">
          <h1 className="text-xl font-bold">{blog.title}</h1>
          <p className="text-base font-normal line-clamp-3 text-pretty font-serif tracking-normal leading-6 text-neutral-700">
            {htmlToText(blog.body)}
          </p>
        </Link>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-x-2">
            {blog.tags.slice(0, 2).map((tag, i) => (
              <Capsule
                key={tag.tagId}
                label={tag.tagName}
                index={i}
                onClick={() => {
                  console.log(tag.tagName);
                }}
                showIcon={false}
                className="shadow-sm border-neutral-400 bg-neutral-50"
              />
            ))}
            <Capsule
              key={blog.blogPostId + 'MinRead'}
              label={`${estimateReadingTime(blog.body)} min read`}
              onClick={() => {}}
              showIcon={false}
              className="shadow-sm border-neutral-400 bg-neutral-50"
            />
          </div>

          <div className="flex items-center space-x-5 my-2 scale-[0.8]">
            <Vote id={blog.blogPostId} initialVoteCounts={blog?.votePayload} />
            <CommentIcon
              size={18}
              count={blog?.votePayload.totalComments}
              onClick={() => {
                navigate(`/blog/${blog.blogPostId}?comments=true`);
              }}
            />
            <Bookmark
              blogPostId={blog.blogPostId}
              bookmarked={blog?.votePayload.isBookmarked}
              className="border-none"
            />
            <BlogOptions id={blog.blogPostId} author={blog.author} />
          </div>
        </div>
      </div>

      <div className="relative min-w-32 min-h-32">
        <img
          src={imageSource}
          alt="Blog Thumbnail"
          className="w-32 h-32 object-cover rounded-md"
          onError={() => {
            setImageSource('https://source.unsplash.com/random');
          }}
        />
      </div>
    </div>
  );
};

export default BlogCard;
