import { IBlog } from '../Interfaces/Models/IBlog';
import { htmlToText, whenDidItHappen } from '../utils/string';
import { Capsule } from './Elements/MultiSelect';

interface IBlogCardProps {
  blog: IBlog;
}
const BlogCard = ({ blog }: IBlogCardProps) => {
  return (
    <div className="flex justify-between gap-x-14 items-center">
      <div className="flex flex-col gap-y-3">
        <div className="flex gap-x-1 items-center">
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
        </div>

        <div className="flex flex-col gap-y-3">
          <h1 className="text-xl font-bold">{blog.title}</h1>
          <p className="text-base font-normal line-clamp-3 text-pretty font-serif tracking-normal leading-6 text-neutral-700">
            {htmlToText(blog.body)}
          </p>
        </div>
        <div className="flex gap-x-2">
          {blog.tags.map((tag, i) => (
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
        </div>
      </div>

      <img
        src={blog.thumbnail ?? 'https://source.unsplash.com/random'}
        className="w-32 h-32 rounded-md"
        alt="Blog Image"
      />
    </div>
  );
};

export default BlogCard;
