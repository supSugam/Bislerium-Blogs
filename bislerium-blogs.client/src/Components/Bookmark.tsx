import { useEffect, useState } from 'react';
import useBookmarksQuery from '../hooks/react-query/useBookmarksQuery';
import { Tooltip } from './Reusables/Tooltip';
import { BookmarkCheck, Bookmark as BookmarkIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../services/stores/useAuthStore';
import toast from 'react-hot-toast';
import { UserRole } from '../enums/UserRole';

interface IBookmarkProps extends React.HTMLProps<HTMLButtonElement> {
  blogPostId: string;
  bookmarked: boolean;
}
const Bookmark = ({ bookmarked, blogPostId, ...rest }: IBookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);
  const { currentUser, openAuthModal } = useAuthStore();
  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const {
    bookmarkBlog: {
      mutateAsync: bookmarkMutateAsync,
      isPending: isBookmarkPending,
    },
    removeBookmark: {
      mutateAsync: removeBookmarkMutateAsync,
      isPending: isBookmarkRemovePending,
    },
  } = useBookmarksQuery({});

  const onToggleBookmark = () => {
    if (!currentUser) {
      toast('You need to be logged in to bookmark a blog post', {
        icon: '🔒',
      });
      openAuthModal();
      return;
    }

    if (currentUser?.role === UserRole.ADMIN) {
      toast('Admins cannot bookmark a blog post', {
        icon: '🔒',
      });
      return;
    }

    if (isBookmarkPending || isBookmarkRemovePending) return;
    if (isBookmarked) {
      removeBookmarkMutateAsync(
        { blogPostId },
        {
          onSuccess: () => {
            setIsBookmarked(false);
          },
        }
      );
    } else {
      bookmarkMutateAsync(
        { blogPostId },
        {
          onSuccess: () => {
            setIsBookmarked(true);
          },
        }
      );
    }
  };

  return (
    <Tooltip label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
      <button
        onClick={onToggleBookmark}
        className={cn(
          'flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white',
          rest.className
        )}
      >
        {isBookmarked ? (
          <BookmarkCheck size={20} />
        ) : (
          <BookmarkIcon size={20} />
        )}
      </button>
    </Tooltip>
  );
};

export default Bookmark;
