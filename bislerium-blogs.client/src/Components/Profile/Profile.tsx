import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBookmarksQuery from '../../hooks/react-query/useBookmarksQuery';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import BlogCard from '../BlogCard';
import { AnimatedTabs } from '../Reusables/AnimatedTabs';
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import { getFormattedDate } from '../../utils/string';
import { Book, Bookmark, Calendar, Clock, Mail, User } from 'lucide-react';
import { IBlog } from '../../Interfaces/Models/IBlog';
import { IUser } from '../../Interfaces/Models/IUser';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../services/stores/useAuthStore';
import {
  IFailedResponse,
  ISuccessResponse,
} from '../../Interfaces/IApiResponse';
import { AxiosError, AxiosResponse } from 'axios';
import { AVATAR_PLACEHOLDER } from '../../utils/constants';

const Profile = () => {
  const { username } = useParams();
  const { api, currentUser } = useAuthStore();

  const { data: blogsData } = useQuery<
    AxiosResponse<ISuccessResponse<IBlog[]>>,
    AxiosError<IFailedResponse>
  >({
    queryFn: async () => await api.get(`/blogs/user/${username}`),
    queryKey: ['blogs'],
    enabled: !!username,
  });

  const {
    getAllBookmarksOfUser: { data: bookmarksData },
  } = useBookmarksQuery({
    id: username,
  });

  const {
    getUserByUsername: { data: userData },
  } = useUsersQuery(currentUser?.username === username ? undefined : username);

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
    if (currentUser?.username === username) setUser(currentUser ?? undefined);
    else setUser(userData?.data?.result);
  }, [userData, currentUser, username]);

  const blogContent = useMemo(() => {
    return (
      <>
        {ownedBlogs.map((blog) => (
          <BlogCard key={blog.blogPostId + blog.createdAt} blog={blog} />
        ))}
      </>
    );
  }, [ownedBlogs]);

  const bookmarkContent = useMemo(() => {
    return (
      <>
        {bookmarks.map((bookmark) => (
          <BlogCard key={bookmark.blogPostId} blog={bookmark} />
        ))}
      </>
    );
  }, [bookmarks]);

  return (
    <div className="w-full">
      <div className="flex gap-x-14 justify-between max-w-[80%] mx-auto">
        <div className="flex w-2/3">
          <AnimatedTabs
            tabs={[
              {
                title: 'Blogs',
                value: 'blogs',
                icon: <Book size={16} color="currentColor" />,
                content: blogContent,
              },
              {
                title: 'Bookmarks',
                value: 'bookmarks',
                icon: <Bookmark size={16} color="currentColor" />,
                content: bookmarkContent,
              },
            ]}
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 h-fit sticky top-0 flex-grow">
          <div className="flex items-center mb-4">
            <img
              src={user?.avatarUrl ?? AVATAR_PLACEHOLDER}
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
