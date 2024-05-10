import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IBlogHistory } from '../../Interfaces/Models/IBlog';
import './BlogPage.css';
import ProfileWithName from '../../Components/Profile/ProfileWithName';
import StyledText from '../../Components/Elements/StyledText';
import {
  capitalizeFirstLetter,
  estimateReadingTime,
  getFormattedDate,
  getRidOfWhiteSpace,
} from '../../utils/string';
import { Capsule } from '../../Components/Elements/MultiSelect';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { Tooltip } from '../../Components/Reusables/Tooltip';
import BlogEditHistory from '../BlogEditor/BlogEditHistory';
import useBlogHistoryQuery from '../../hooks/react-query/useBlogHistoryQuery';

const BlogHistoryPage = () => {
  const [blogData, setBlogData] = useState<IBlogHistory>();
  const { id } = useParams();
  const {
    getBlogHistoryById: { data: blogResponse },
  } = useBlogHistoryQuery({ blogHistoryId: id });

  useEffect(() => {
    setBlogData(blogResponse?.data?.result);
    document.title = blogResponse?.data?.result?.title || 'Blog History';
  }, [blogResponse]);

  const [blogEditHistoryModalOpen, setBlogEditHistoryModalOpen] =
    useState<boolean>(false);

  return (
    <main id="blog-page" className="w-full flex justify-center">
      {blogData && (
        <BlogEditHistory
          blogPostId={blogData?.blogPostId}
          isOpen={blogEditHistoryModalOpen}
          onClose={() => setBlogEditHistoryModalOpen(false)}
        />
      )}

      {blogData && (
        <motion.article
          id="blog-contents"
          className="flex flex-col px-5 md:px-0 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 mt-8"
          initial={{ marginRight: 0 }}
          transition={{ duration: 0.3, when: 'beforeChildren' }}
        >
          <h1 className="blog-title">{blogData?.title}</h1>

          <div className="flex flex-row gap-2 p-2 my-6 no-scrollbar overflow-x-auto items-center max-w-full">
            {(blogData?.tags ?? []).map((tag, i) => (
              <Capsule
                key={tag.tagId}
                label={tag.tagName}
                onClick={() => {}}
                disabled
                index={i}
                showIcon={false}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <ProfileWithName
              username={blogData?.author.username}
              name={
                <StyledText className="text-base leading-tight ml-1">
                  {blogData?.author.fullName}
                </StyledText>
              }
              avatar={blogData?.author.avatarUrl}
              subtitle={
                <StyledText className="text-sm font-medium ml-1">
                  {capitalizeFirstLetter(blogData?.author.role)}
                </StyledText>
              }
              avatarSize={50}
            />
            <div className="flex justify-between items-end flex-col flex-shrink-0 gap-y-1">
              <StyledText className="text-sm font-thin">
                {getFormattedDate(blogData?.updatedAt)}
              </StyledText>
              <StyledText className="text-sm font-thin">
                {estimateReadingTime(blogData?.body)} min read
              </StyledText>
            </div>
          </div>

          <div className="flex justify-between items-center px-2 py-1 w-full border-y border-neutral-200 my-6">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-thin">
                {blogData.changesSummary}{' '}
                <Link
                  to={`/blog/${blogData.blogPostId}`}
                  className="text-primary-500 hover:underline"
                >
                  View Original
                </Link>
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <Tooltip label="See Edit History">
                <button
                  onClick={() => setBlogEditHistoryModalOpen(true)}
                  className="flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white"
                >
                  <History size={20} />
                </button>
              </Tooltip>
            </div>
          </div>
          {/* Thumbnail */}
          {blogData?.thumbnail && (
            <img
              src={blogData?.thumbnail}
              alt="Thumbnail"
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
          {/* Body */}
          <div
            id="blog-body"
            dangerouslySetInnerHTML={{
              __html: getRidOfWhiteSpace(blogData?.body),
            }}
          />
        </motion.article>
      )}
    </main>
  );
};

export default BlogHistoryPage;
