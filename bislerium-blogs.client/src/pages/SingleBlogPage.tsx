import { useEffect } from 'react';
import useBlogsQuery from '../hooks/react-query/useBlogsQuery';
import { useParams } from 'react-router-dom';

const SingleBlogPage = () => {
  const { id } = useParams();
  const {
    getBlogById: { data: blogData },
  } = useBlogsQuery({ id });

  useEffect(() => {
    console.log(blogData);
  }, [blogData]);
  return (
    <main
      id="blog-page"
      className="mx-auto flex flex-col items-center justify-center w-[90%] xl:w-[65%]"
      dangerouslySetInnerHTML={{ __html: blogData?.data?.result?.body || '' }}
    />
  );
};

export default SingleBlogPage;
