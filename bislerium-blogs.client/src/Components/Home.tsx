import { useEffect, useMemo, useState } from 'react';
import { IBlogPaginationDto, SortBy } from '../Interfaces/IPagination';
import useBlogsQuery from '../hooks/react-query/useBlogsQuery';
import { IBlog } from '../Interfaces/Models/IBlog';
import BlogCard from './BlogCard';
import useTagsQuery from '../hooks/react-query/useTagsQuery';
import Dropdown, { DropdownItem } from './Reusables/Dropdown';
import useThrottle from '../hooks/useThrottle';
import { SearchIcon } from 'lucide-react';
import { Capsule } from './Elements/MultiSelect';
import StyledInput from './Elements/StyledInput';
import { capitalizeFirstLetter } from '../utils/string';
import { cn } from '../utils/cn';
import YearAndMonthPicker from './YearAndMonthPicker';
import { AnimatePresence } from 'framer-motion';
import Paginate from './Paginate';

const Home = () => {
  const [searchInput, setSearchInput] = useState<string>();
  const throttledSearchInput = useThrottle(searchInput, 500);
  const [paginationQueryParams, setPaginationQueryParams] =
    useState<IBlogPaginationDto>({
      pageNumber: 1,
      pageSize: 3,
      sortBy: SortBy.OLDEST,
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

  const sortOptions = useMemo(() => {
    return Object.values(SortBy)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => {
        return {
          label: capitalizeFirstLetter(SortBy[key as number]),
          onClick: () => {
            setPaginationQueryParams((prev) => ({
              ...prev,
              sortBy: key as SortBy,
            }));
          },
          className: cn({
            'font-semibold': paginationQueryParams.sortBy === key,
          }),
        } as DropdownItem;
      });
  }, [setPaginationQueryParams, paginationQueryParams]);

  return (
    <AnimatePresence>
      <main className="w-full h-screen">
        <section className="mx-auto flex gap-x-12 justify-between w-full sm:w-11/12 md:w-10/12 lg:w-4/5 min-h-[80%]">
          {/*  */}
          <div className="flex flex-col flex-1 gap-y-4">
            <div className="flex flex-col w-full gap-y-2 mb-6">
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
              <div className="no-scrollbar flex gap-x-2 px-2 py-1 overflow-x-auto ">
                {(tagsData?.data?.result ?? []).map((tag) => (
                  <Capsule
                    key={tag.tagId}
                    onClick={() => {
                      setPaginationQueryParams((prev) => ({
                        ...prev,
                        tag: prev.tag === tag.tagName ? undefined : tag.tagName,
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

          <div className="flex gap-y-5 w-1/3 pl-10 border-l border-neutral-300 relative">
            <div className="flex flex-col gap-y-5 sticky top-0 left-0 w-full">
              <Dropdown
                items={sortOptions}
                closeOnClick
                targetComponent={
                  <StyledInput
                    value={capitalizeFirstLetter(
                      SortBy[paginationQueryParams.sortBy]
                    )}
                    id="role"
                    type="text"
                    readOnly
                    className="cursor-pointer"
                  />
                }
                takeParentWidth
                gap={2}
              />
              <YearAndMonthPicker
                onYearAndMonthChange={(date) => {
                  setPaginationQueryParams((prev) => ({
                    ...prev,
                    ofThisSpecificMonth: date,
                  }));
                }}
              />
              <Paginate
                onPageChange={(pageNumber) => {
                  setPaginationQueryParams((prev) => ({
                    ...prev,
                    pageNumber,
                  }));
                }}
                pageSize={paginationQueryParams.pageSize}
                totalItems={blogsData?.data.result.totalBlogs || 0}
                currentPage={paginationQueryParams.pageNumber}
              />
            </div>
          </div>
        </section>
      </main>
    </AnimatePresence>
  );
};

export default Home;
