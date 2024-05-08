import { useEffect, useState } from 'react';
import { IBlogPaginationDto, SortBy } from '../Interfaces/IPagination';
import useBlogsQuery from '../hooks/react-query/useBlogsQuery';
import { IBlog } from '../Interfaces/Models/IBlog';
import BlogCard from './BlogCard';
import useTagsQuery from '../hooks/react-query/useTagsQuery';
import Dropdown from './Reusables/Dropdown';
import useThrottle from '../hooks/useThrottle';
import { SearchIcon } from 'lucide-react';
import { Capsule } from './Elements/MultiSelect';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchInput, setSearchInput] = useState<string>();
  const throttledSearchInput = useThrottle(searchInput, 500);
  const [paginationQueryParams, setPaginationQueryParams] =
    useState<IBlogPaginationDto>({
      pageNumber: 1,
      pageSize: 3,
    });

  const {
    getBlogs: { data: blogsData },
  } = useBlogsQuery({
    getAllBlogsConfig: {
      params: paginationQueryParams,
    },
  });

  const [blogs, setBlogs] = useState<IBlog[]>([]);

  useEffect(() => {
    setBlogs(blogsData?.data.result.blogs || []);
  }, [blogsData]);

  const {
    getTags: { data: tagsData },
  } = useTagsQuery({
    getAllTagsConfig: {
      queryOptions: {
        enabled: true,
      },
    },
  });

  useEffect(() => {
    setPaginationQueryParams((prev) => ({
      ...prev,
      search: throttledSearchInput,
    }));
  }, [throttledSearchInput]);

  // update route on paginationQueryParams change
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      search: `?search=${paginationQueryParams.search}&tag=${paginationQueryParams.tag}&page=${paginationQueryParams.pageNumber}`,
    });
  }, [paginationQueryParams, navigate]);

  //Initial load, setting params

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const tag = params.get('tag');
    const page = params.get('page');
    setPaginationQueryParams((prev) => ({
      ...prev,
      search: search || '',
      tag: tag || undefined,
      pageNumber: page ? parseInt(page) : 1,
    }));
  }, []);

  return (
    <main className="w-full">
      <section className="mx-auto flex gap-x-8 justify-evenly w-full min-h-screen sm:w-11/12 md:w-10/12 lg:w-4/5">
        {/*  */}
        <div className="flex flex-col gap-y-8 flex-1">
          <div className="flex flex-col w-full gap-y-4">
            <Dropdown
              targetComponent={
                <div className="flex justify-center gap-3 items-center bg-gray-100 rounded-md px-2">
                  <SearchIcon size={20} />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                    placeholder="Search for blogs..."
                    className="focus:outline-none px-1 py-2 placeholder:text-sm text-sm bg-gray-100 w-full"
                  />
                </div>
              }
              items={[]}
            />
            <div className="no-scrollbar flex gap-x-2 px-2 py-1 overflow-x-auto">
              {(tagsData?.data?.result ?? []).map((tag) => (
                <Capsule
                  key={tag.tagId}
                  onClick={() => {
                    setPaginationQueryParams((prev) => ({
                      ...prev,
                      tag: tag.tagName,
                    }));
                  }}
                  showIcon={false}
                  selected={paginationQueryParams.tag === tag.tagName}
                  label={tag.tagName}
                />
              ))}
            </div>
          </div>
          {blogs.map((blog) => (
            <BlogCard key={blog.blogPostId} blog={blog} />
          ))}
        </div>

        <div className="flex flex-col gap-y-5 w-1/3 bg-red-300 px-5 border-l border-neutral-300 min-h-full"></div>
      </section>
    </main>
  );
};

export default Home;
