import {
  Bookmark,
  Book,
  ThumbsDown,
  ThumbsUp,
  Users,
  MessageSquare,
  Flame,
  ArrowUpRightFromSquare,
} from 'lucide-react';
import { IDashboardStats, ITop10Stats } from '../../Interfaces/IDashboard';
import StatCard from './StatCard';
import useDashboardQuery from '../../hooks/react-query/useDashboardQuery';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Counter from './Counter';
import BlogCard from '../BlogCard';
import Dropdown from '../Reusables/Dropdown';
import YearAndMonthPicker from '../YearAndMonthPicker';
import StyledInput from '../Elements/StyledInput';
import { AVATAR_PLACEHOLDER } from '../../utils/constants';
import { UserRole } from '../../enums/UserRole';
import { Link } from 'react-router-dom';

const InitialDashboardStats: IDashboardStats = {
  totalBloggers: 0,
  totalBlogs: 0,
  totalBookmarks: 0,
  totalComments: 0,
  totalUpvotesOnBlog: 0,
  totalDownvotesOnBlog: 0,
  totalUpvotesOnComment: 0,
  totalDownvotesOnComment: 0,
  mostPopularBlog: null,
};

const InitialTop10Stats = {
  top10Blogs: [],
  top10Bloggers: [],
};

const Dashboard = () => {
  const [statsOfThisMonth, setStatsOfThisMonth] = useState<Date | undefined>();
  const [top10StatsOfThisMonth, setTop10StatsOfThisMonth] = useState<
    Date | undefined
  >();

  const {
    getDashboardStats: { data: dashboardStatsData },
    getTop10Stats: { data: top10StatsData },
  } = useDashboardQuery({
    statsOfThisSpecificMonth: statsOfThisMonth,
    top10StatsOfThisSpecificMonth: top10StatsOfThisMonth,
  });

  const [stats, setStats] = useState<IDashboardStats>(InitialDashboardStats);

  const [top10Stats, setTop10Stats] = useState<ITop10Stats>(InitialTop10Stats);

  useEffect(() => {
    setStats(dashboardStatsData?.data?.result ?? InitialDashboardStats);
  }, [dashboardStatsData]);

  useEffect(() => {
    setTop10Stats(top10StatsData?.data?.result ?? InitialTop10Stats);
  }, [top10StatsData]);
  return (
    <main className="w-full min-h-screen">
      <div className="container mx-auto px-4 max-w-[90%]">
        <div className="flex justify-between items-center mb-5 ">
          <h1 className="text-[26px] font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <Dropdown
            items={[
              {
                element: (
                  <YearAndMonthPicker
                    onYearAndMonthChange={(date) => {
                      setStatsOfThisMonth(date);
                    }}
                  />
                ),
              },
            ]}
            closeOnClick={false}
            targetComponent={
              <StyledInput
                placeholder="Select Month"
                value={
                  statsOfThisMonth
                    ? statsOfThisMonth.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })
                    : 'All Time'
                }
                readOnly
                className="w-96 text-base font-medium cursor-pointer"
              />
            }
            takeParentWidth
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-primary" />}
            value={stats.totalBloggers}
            label="Total Bloggers"
          />
          <StatCard
            icon={<Book className="text-primary" />}
            value={stats.totalBlogs}
            label="Total Blogs"
          />
          <StatCard
            icon={<Bookmark className="text-primary" />}
            value={stats.totalBookmarks}
            label="Total Bookmarks"
          />
          <StatCard
            icon={<MessageSquare className="text-primary" />}
            value={stats.totalComments}
            label="Total Comments"
          />
          <StatCard
            icon={<ThumbsUp className="text-green-500" />}
            value={stats.totalUpvotesOnBlog}
            label="Upvotes on Blogs"
          />
          <StatCard
            icon={<ThumbsDown className="text-red-500" />}
            value={stats.totalDownvotesOnBlog}
            label="Downvotes on Blogs"
          />
          <StatCard
            icon={<ThumbsUp className="text-green-500" />}
            value={stats.totalUpvotesOnComment}
            label="Upvotes on Comments"
          />
          <StatCard
            icon={<ThumbsDown className="text-red-500" />}
            value={stats.totalDownvotesOnComment}
            label="Downvotes on Comments"
          />
        </div>
        {stats.mostPopularBlog && (
          <div className="grid grid-flow-col gap-x-8">
            <div className="bg-indigo-100 rounded-lg shadow-normal p-6 px-12 flex flex-col items-center border-neutral-300 justify-center">
              <div className="text-4xl text-primary mb-2">
                <Flame size={40} />
              </div>
              <div className="text-3xl font-bold">
                <AnimatePresence mode="wait">
                  <motion.span key={stats.mostPopularBlog?.popularity}>
                    {stats.mostPopularBlog?.popularity === 0 ? (
                      0
                    ) : (
                      <Counter
                        value={stats.mostPopularBlog?.popularity ?? 0}
                        direction="up"
                      />
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="text-neutral-700 text-lg mt-1">
                Most Popular Blog
              </div>

              <div className="text-neutral-600 text-base font-medium text-center mt-3">
                "{stats.mostPopularBlog?.title}"
              </div>
            </div>
            <div className="flex p-4 bg-white rounded-md border-neutral-200 flex-1 shadow-normal">
              <BlogCard blog={stats.mostPopularBlog} className="border-none" />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-10 mb-8">
          <h1 className="text-[26px] font-bold tracking-tight">
            Top Blogs & Bloggers
          </h1>
          <Dropdown
            items={[
              {
                element: (
                  <YearAndMonthPicker
                    onYearAndMonthChange={(date) => {
                      setTop10StatsOfThisMonth(date);
                    }}
                  />
                ),
              },
            ]}
            closeOnClick={false}
            targetComponent={
              <StyledInput
                placeholder="Select Month"
                value={
                  top10StatsOfThisMonth
                    ? top10StatsOfThisMonth.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })
                    : 'All Time'
                }
                readOnly
                className="w-96 text-base font-medium cursor-pointer"
              />
            }
            takeParentWidth
          />
        </div>

        <div className="flex justify-between gap-x-14 min-h-96">
          <div className="flex flex-col gap-y-6">
            {top10Stats.top10Blogs.map((blog) => (
              <BlogCard key={blog.blogPostId} blog={blog} />
            ))}
          </div>
          <div className="flex flex-col gap-y-2 min-w-96 flex-1">
            {top10Stats.top10Bloggers
              .filter((user) => user.role === UserRole.BLOGGER)
              .map((blogger) => (
                <div
                  key={blogger.userId}
                  className="bg-white rounded-md shadow-normal p-4 border-neutral-200 w-full flex justify-between items-center gap-x-4"
                >
                  <div className="flex items-center">
                    <img
                      src={blogger.avatarUrl ?? AVATAR_PLACEHOLDER}
                      alt={blogger.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-2">
                      <div className="text-lg font-bold">
                        {blogger.fullName}
                      </div>
                      <div className="text-neutral-600 text-sm">
                        {blogger.username}
                      </div>
                    </div>
                  </div>
                  <Link to={`/profile/${blogger.username}`}>
                    <ArrowUpRightFromSquare size={20} />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
