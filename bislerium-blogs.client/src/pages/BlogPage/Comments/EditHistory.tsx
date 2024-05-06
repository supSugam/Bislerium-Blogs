import { useEffect, useState } from 'react';
import useCommentsQuery from '../../../hooks/react-query/useCommentsQuery';
import Modal from '../../../Components/Modal/Modal';
import { cn } from '../../../utils/cn';
import { ICommentHistory } from '../../../Interfaces/Models/IComment';
import { getFormattedDate, whenDidItHappen } from '../../../utils/string';
import { AVATAR_PLACEHOLDER } from '../../../utils/constants';
import { IUser } from '../../../Interfaces/Models/IUser';
import XButton from '../../../Components/Smol/XButton';

interface ICommentEditHistoryProps {
  commentId: string;
  isOpen: boolean;
  onClose: () => void;
  author: IUser;
}
const EditHistory = ({
  commentId,
  isOpen,
  onClose,
  author,
}: ICommentEditHistoryProps) => {
  const [commentEditHistory, setCommentEditHistory] = useState<
    ICommentHistory[]
  >([]);
  const {
    getCommentEditHistory: {
      data: commentEditHistoryData,
      isLoading: isCommentEditHistoryLoading,
    },
  } = useCommentsQuery({ id: commentId });

  useEffect(() => {
    setCommentEditHistory(commentEditHistoryData?.data.result ?? []);
  }, [commentEditHistoryData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-5 w-11/12 sm:w-3/5 md:3/5 lg:w-2/5 xl:w-4/12 max-w-none"
    >
      <div className="flex flex-col gap-y-3 w-full">
        <div className="flex justify-between items-center gap-x-3 border-b border-neutral-300 pb-2">
          <h1 className="text-xl font-bold">Edit History</h1>
          <XButton onClick={onClose} />
        </div>
        <div
          className={cn('flex flex-col gap-y-3 w-full  min-h-24', {
            'items-center justify-center': isCommentEditHistoryLoading,
          })}
        >
          {commentEditHistory.map(({ updatedAt, body, commentHistoryId }) => (
            <div
              className={cn(
                ' flex flex-col gap-y-3 border-b border-neutral-200 pb-2 w-full',
                {}
              )}
              key={commentHistoryId}
            >
              <div className="flex justify-between gap-x-3">
                {/* Image */}
                <img
                  src={author.avatarUrl ?? AVATAR_PLACEHOLDER}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col gap-y-2 flex-grow">
                  <div className="flex-col flex">
                    <h3 className="text-sm font-normal">
                      {author?.fullName ?? 'Surfer Subedi'}
                    </h3>
                    <p className="text-sm text-secondary">
                      {whenDidItHappen(updatedAt)}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-neutral-400 self-end">
                  {getFormattedDate(updatedAt, true)}
                </span>
              </div>

              <span
                dangerouslySetInnerHTML={{
                  __html: body,
                }}
                className="text-[15px] text-pretty leading-normal"
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EditHistory;
