import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBookmarksQuery from '../../hooks/react-query/useBookmarksQuery';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import BlogCard from '../BlogCard';
import { AnimatedTabs } from '../Reusables/AnimatedTabs';
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import { AVATAR_PLACEHOLDER } from '../../utils/constants';
import { getFormattedDate } from '../../utils/string';
import {
  Book,
  Bookmark,
  Calendar,
  Clock,
  Mail,
  ShieldCheckIcon,
  User,
} from 'lucide-react';
import { IBlog } from '../../Interfaces/Models/IBlog';
import { IUser } from '../../Interfaces/Models/IUser';

const Profile = () => {
  const { username } = useParams();

  const {
    getAllBookmarksOfUser: { data: bookmarksData },
  } = useBookmarksQuery({
    id: username,
  });

  const {
    getAllBlogsOfUser: { data: blogsData },
  } = useBlogsQuery({
    id: username,
  });

  const {
    getUserByUsername: { data: userData },
  } = useUsersQuery(username);

  const [ownedBlogs, setOwnedBlogs] = useState<IBlog[]>([]);
  const [bookmarks, setBookmarks] = useState<IBlog[]>([]);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    setOwnedBlogs(blogsData?.data?.result ?? []);
  }, [blogsData]);

  useEffect(() => {
    setBookmarks(bookmarksData?.data?.result ?? []);
  }, [bookmarksData]);

  useEffect(() => {
    setUser(userData?.data?.result);
  }, [userData]);

  return (
    <div className="w-full">
      <div className="flex gap-x-12 justify-between max-w-[80%] mx-auto">
        <div className="flex w-2/3">
          <AnimatedTabs
            tabs={[
              {
                title: 'Blogs',
                value: 'blogs',
                icon: <Book size={16} color="currentColor" />,
                content: (
                  <>
                    {ownedBlogs.map((blog) => (
                      <BlogCard
                        key={blog.blogPostId + blog.createdAt}
                        blog={blog}
                        className="w-full"
                      />
                    ))}
                  </>
                ),
              },
              {
                title: 'Bookmarks',
                value: 'bookmarks',
                icon: <Bookmark size={16} color="currentColor" />,
                content: (
                  <>
                    {bookmarks.map((bookmark) => (
                      <BlogCard key={bookmark.blogPostId} blog={bookmark} />
                    ))}
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 h-fit sticky top-0">
          <div className="flex items-center mb-4">
            <img
              src={user?.avatarUrl ?? '/placeholder-avatar.png'}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{user?.fullName}</h3>
              <div className="flex items-center text-sm text-neutral-500">
                <User size={16} className="mr-1" />
                <span>{user?.username}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <Mail size={16} className="mr-2 text-neutral-500" />
            <span className="text-sm text-neutral-500">{user?.email}</span>
          </div>
          <div className="flex items-center mb-2">
            <Calendar size={16} className="mr-2 text-neutral-500" />
            <span className="text-sm text-neutral-500">
              {`Joined on ${getFormattedDate(user?.createdAt)}`}
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-neutral-500" />
            <span className="text-sm text-neutral-500">
              {`Last updated on ${getFormattedDate(user?.updatedAt)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
