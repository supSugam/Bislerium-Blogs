import { useEffect, useState } from 'react';
import useBookmarksQuery from '../hooks/react-query/useBookmarksQuery';
import { Tooltip } from './Reusables/Tooltip';
import { BookmarkCheck, Bookmark as BookmarkIcon } from 'lucide-react';

interface IBookmarkProps {
  blogPostId: string;
  bookmarked: boolean;
}
const Bookmark = ({ bookmarked, blogPostId }: IBookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);

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
  } = useBookmarksQuery();

  const onToggleBookmark = () => {
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
        className="flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white"
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
