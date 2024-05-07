import { useEffect, useState } from 'react';
import { History, SquareArrowOutUpRight } from 'lucide-react';
import { IBlogHistoryPreview } from '../../Interfaces/Models/IBlog';
import useBlogHistoryQuery from '../../hooks/react-query/useBlogHistoryQuery';
import { IUser } from '../../Interfaces/Models/IUser';
import XButton from '../../Components/Smol/XButton';
import Modal from '../../Components/Modal/Modal';
import { cn } from '../../utils/cn';
import { whenDidItHappen } from '../../utils/string';
import { Link } from 'react-router-dom';

interface IBlogEditHistoryProps {
  blogPostId: string;
  isOpen: boolean;
  onClose: () => void;
  author?: IUser;
}
const BlogEditHistory = ({
  blogPostId,
  isOpen,
  onClose,
}: IBlogEditHistoryProps) => {
  const [blogEditHistory, setBlogEditHistory] = useState<IBlogHistoryPreview[]>(
    []
  );
  const {
    getBlogHistoryPreviewById: {
      data: blogEditHistoryPreviewData,
      isLoading: isBlogEditHistoryLoading,
    },
  } = useBlogHistoryQuery({ blogPostId });

  useEffect(() => {
    setBlogEditHistory(blogEditHistoryPreviewData?.data?.result ?? []);
  }, [blogEditHistoryPreviewData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-5 w-11/12 sm:w-3/5 md:3/5 lg:w-2/5 xl:w-4/12 max-w-none"
    >
      <div className="flex flex-col gap-y-3 w-full">
        <div className="flex justify-between items-center gap-x-3 border-b border-neutral-300 pb-2">
          <div className="flex gap-x-1 items-center">
            <History size={21} />
            <h1 className="text-xl font-bold">Past Versions</h1>
          </div>
          <XButton onClick={onClose} />
        </div>
        <div
          className={cn('flex flex-col gap-y-3 w-full  min-h-24', {
            'items-center justify-center': isBlogEditHistoryLoading,
          })}
        >
          {blogEditHistory
            .filter((h) => !!h.changesSummary)
            .map(
              (
                {
                  updatedAt,
                  blogPostHistoryId,
                  changesSummary,
                  thumbnail,
                  title,
                },
                i
              ) => (
                <div
                  className={cn(
                    ' flex flex-col gap-y-3 border-b border-neutral-200 py-2 w-full',
                    {
                      'pb-4':
                        i ===
                        blogEditHistory.filter((h) => !!h.changesSummary)
                          .length -
                          1,
                    }
                  )}
                  key={blogPostHistoryId}
                >
                  <div className="flex justify-between gap-x-3">
                    {/* Image */}
                    <img
                      src={thumbnail}
                      alt="Profile"
                      className="w-10 h-10 rounded-md"
                    />
                    <div className="flex flex-col gap-y-2 flex-grow">
                      <div className="flex-col flex gap-1">
                        <h3 className="text-sm font-normal line-clamp-1 max-w-[50%]">
                          {title}
                        </h3>
                        <p className="text-sm text-secondary">
                          {whenDidItHappen(updatedAt)}
                          &nbsp;&middot;&nbsp; Later&nbsp;
                          {changesSummary.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/blogs/history/${blogPostHistoryId}`}
                      target="_blank"
                      className="opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-100 ease-in cursor-pointer"
                    >
                      <SquareArrowOutUpRight size={20} />
                    </Link>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </Modal>
  );
};

export default BlogEditHistory;
