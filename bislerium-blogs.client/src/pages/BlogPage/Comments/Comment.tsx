import {
  FlagIcon,
  History,
  MoreHorizontal,
  Pencil,
  ReplyIcon,
  Trash,
  Undo,
} from 'lucide-react';
import { IComment } from '../../../Interfaces/Models/IComment';
import { whenDidItHappen } from '../../../utils/string';
import Vote from '../../../Components/Vote';
import CommentIcon from '../../../Components/Smol/CommentIcon';
import { cn } from '../../../utils/cn';
import CommentInput from './CommentInput';
import { useMemo, useRef, useState } from 'react';
import { AnimateHeight } from '../../../Components/Reusables/AnimatedHeight';
import { AVATAR_PLACEHOLDER } from '../../../utils/constants';
import Dropdown, { DropdownItem } from '../../../Components/Reusables/Dropdown';
import toast from 'react-hot-toast';
import useCommentsQuery from '../../../hooks/react-query/useCommentsQuery';
import EditHistory from './EditHistory';
import { useAuthStore } from '../../../services/stores/useAuthStore';
import { UserRole } from '../../../enums/UserRole';

interface ICommentProps {
  comment: IComment;
}
const Comment = ({ comment }: ICommentProps) => {
  const {
    author,
    body,
    isEdited,
    commentId,
    reactions,
    replies,
    parentCommentId,
  } = comment;

  const onExpandReplies = () => {
    if (replies.length === 0) return;
    setIsRepliesExpanded((prev) => !prev);
  };

  const { currentUser } = useAuthStore();

  const [isRepliesExpanded, setIsRepliesExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<'reply' | 'edit' | 'none'>('none');
  const [editHistoryModalOpen, setEditHistoryModalOpen] =
    useState<boolean>(false);
  const replyComponentRef = useRef<HTMLDivElement>(null);

  const onReplyToComment = () => {
    mode === 'reply' ? setMode('none') : setMode('reply');
    replyComponentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const { deleteComment } = useCommentsQuery({});

  const commentOptions = useMemo(() => {
    const options: DropdownItem[] = [
      {
        label: 'Reply',
        onClick: onReplyToComment,
        icon: <ReplyIcon size={18} />,
      },
    ];

    if (currentUser) {
      if (currentUser?.userId === author.userId) {
        options.push({
          label: 'Edit',
          onClick: () => setMode('edit'),
          icon: <Pencil size={18} />,
        });
      }

      if (
        currentUser?.role === UserRole.ADMIN ||
        currentUser?.userId === author.userId
      ) {
        options.push({
          label: 'Delete Comment',
          onClick: () => {
            deleteComment.mutate({
              id: commentId,
              blogPostId: comment.blogPostId,
            });
          },
          icon: <Trash size={18} />,
        });
      }
    }

    options.push(
      {
        label: 'See Edit History',
        onClick: () => setEditHistoryModalOpen(true),
        icon: <History size={18} />,
      },
      {
        label: 'Report',
        onClick: () => {
          toast('Maybe Next Update !?', { icon: '🚀' });
        },
        icon: <FlagIcon size={18} />,
      }
    );

    return options;
  }, [commentId, comment.blogPostId, deleteComment, author, currentUser]);

  return (
    <div
      className={cn(' flex flex-col gap-y-3', {
        'border-b border-neutral-200 pb-2':
          !parentCommentId && !isRepliesExpanded,
        'ml-4 pl-3': !!parentCommentId,
        'border-l-2 border-neutral-200 pb-3': !!parentCommentId,
      })}
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
              {whenDidItHappen(comment.createdAt)}
              {isEdited && ' (Edited)'}
            </p>
          </div>
        </div>
        <Dropdown
          targetComponent={
            <button className="flex items-center justify-center">
              <MoreHorizontal size={20} />
            </button>
          }
          items={commentOptions}
          closeOnClick
        />
      </div>

      <span
        dangerouslySetInnerHTML={{
          __html: body,
        }}
        className="text-[15px] text-pretty leading-normal"
      />

      <div className="flex justify-between items-center w-full">
        <div className="flex gap-x-3 items-center">
          <Vote
            id={commentId}
            initialVoteCounts={reactions}
            type="comment"
            className="scale-90"
          />
          <CommentIcon
            size={18}
            count={replies.length}
            onClick={onExpandReplies}
            className={cn('hover:text-primary-500 scale-90 cursor-pointer', {
              'disabled cursor-not-allowed': replies.length === 0,
            })}
          />
        </div>

        <span className="w-auto cursor-pointer" onClick={onReplyToComment}>
          Reply
        </span>
      </div>
      <AnimateHeight>
        <div
          ref={replyComponentRef}
          className={cn(
            'w-full overflow-hidden ml-2 my-2 border-l-2 border-neutral-200',
            {
              'h-0': mode === 'none',
              'h-auto': mode !== 'none',
            }
          )}
        >
          {mode === 'edit' && (
            <CommentInput
              mode="edit"
              {...{ comment: body, commentId }}
              onCommentSubmit={() => setMode('none')}
            />
          )}
          {mode === 'reply' && (
            <CommentInput
              mode="reply"
              {...{
                parentCommentId: commentId,
                blogPostId: comment.blogPostId,
              }}
              onCommentSubmit={() => setMode('none')}
            />
          )}
        </div>
      </AnimateHeight>
      <AnimateHeight>
        <div
          className={cn('w-full', {
            'h-0': !isRepliesExpanded,
            'h-auto': isRepliesExpanded,
          })}
        >
          {replies.map((reply) => (
            <Comment key={reply.commentId} comment={reply} />
          ))}
        </div>
      </AnimateHeight>
      <EditHistory
        commentId={commentId}
        isOpen={editHistoryModalOpen}
        onClose={() => setEditHistoryModalOpen(false)}
        author={author}
      />
    </div>
  );
};

export default Comment;
