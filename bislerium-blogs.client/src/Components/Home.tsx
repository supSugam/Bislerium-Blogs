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
      tags: [],
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

  // useEffect(() => {
  //   setPaginationQueryParams((prev) => ({
  //     ...prev,
  //     search: throttledSearchInput,
  //   }));
  // }, [throttledSearchInput]);

  // // update route on paginationQueryParams change
  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigate({
  //     search: new URLSearchParams(paginationQueryParams as any).toString(),
  //   });
  // }, [paginationQueryParams, navigate]);

  // Initial load, setting params

  // useEffect(() => {
  //   const urlSearchParams = new URLSearchParams(window.location.search);
  //   const searchParams = Object.fromEntries(urlSearchParams.entries());
  //   const tags = searchParams.tags ? searchParams.tags.split(',') : [];
  //   setPaginationQueryParams({
  //     pageNumber: Number(searchParams.pageNumber) || 1,
  //     pageSize: Number(searchParams.pageSize) || 3,
  //     tags,
  //     search: searchParams.search,
  //   });
  // }, []);

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
                    setPaginationQueryParams((prev) =>
                      prev.tags.includes(tag.tagName)
                        ? {
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag.tagName),
                          }
                        : { ...prev, tags: [...prev.tags, tag.tagName] }
                    );
                  }}
                  showIcon={false}
                  selected={paginationQueryParams.tags.includes(tag.tagName)}
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
