import { useEffect, useState } from 'react';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import { useParams } from 'react-router-dom';
import { IBlog } from '../../Interfaces/Models/IBlog';
import './BlogPage.css';
import ProfileWithName from '../../Components/Profile/ProfileWithName';
import StyledText from '../../Components/Elements/StyledText';
import {
  capitalizeFirstLetter,
  estimateReadingTime,
  getFormattedDate,
} from '../../utils/string';
import { Capsule } from '../../Components/Elements/MultiSelect';
import Vote from '../../Components/Vote';
const SingleBlogPage = () => {
  const [blogData, setBlogData] = useState<IBlog>();
  const { id } = useParams();
  const {
    getBlogById: { data: blogResponse },
  } = useBlogsQuery({ id });

  useEffect(() => {
    setBlogData(blogResponse?.data?.result);
    document.title = blogResponse?.data?.result?.title || 'Blog';
  }, [blogResponse]);

  // Upvote/Downvote functionality

  return (
    <main
      id="blog-page"
      className="w-full mx-auto flex flex-col items-center justify-center"
    >
      {blogData && (
        <>
          <article
            id="blog-contents"
            className="flex flex-col px-5 md:px-0 w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12"
          >
            <h1 className="blog-title">{blogData?.title}</h1>

            <div className="flex flex-row gap-2 p-2 my-6 no-scrollbar overflow-x-auto items-center max-w-full">
              {blogData?.tags.map((tag, i) => (
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
                  {getFormattedDate(blogData?.createdAt)}
                </StyledText>
                <StyledText className="text-sm font-thin">
                  {estimateReadingTime(blogData?.body)} min read
                </StyledText>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 py-3 w-full border-y border-neutral-200 my-6">
              <Vote
                id={blogData.blogPostId}
                initialVoteCounts={blogData?.votePayload}
              />
            </div>
          </article>
        </>
      )}
    </main>
  );
};

export default SingleBlogPage;
