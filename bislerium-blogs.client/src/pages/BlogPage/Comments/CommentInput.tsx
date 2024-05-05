import StyledButton from '../../../Components/Elements/StyledButton';
import { useAuthStore } from '../../../services/stores/useAuthStore';
import useCommentsQuery from '../../../hooks/react-query/useCommentsQuery';
import { createRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { motion } from 'framer-motion';
import { AVATAR_PLACEHOLDER } from '../../../utils/constants';
interface ICommentInputProps {
  blogPostId?: string;
  parentCommentId?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCommentSubmit?: () => void;
}
const CommentInput = ({
  blogPostId,
  parentCommentId,
  onCommentSubmit,
}: ICommentInputProps) => {
  const { currentUser, openAuthModal } = useAuthStore();
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const commentInputRef = createRef<HTMLDivElement>();
  const {
    publishComment: { mutateAsync: publishCommentMutation, isPending },
  } = useCommentsQuery({});

  const onSubmit = async () => {
    if (!currentUser || !blogPostId) {
      openAuthModal();
      return;
    }
    const body = commentInputRef.current?.innerHTML;
    if (!body) return;
    onCommentSubmit?.();
    await publishCommentMutation(
      {
        body,
        blogPostId,
        parentCommentId: parentCommentId ?? null,
      },
      {
        onSuccess: () => {
          if (commentInputRef.current) {
            commentInputRef.current.textContent = '';
            setShowPlaceholder(true);
          } else {
            const el = document.getElementById('comment-input');
            if (el) {
              el.textContent = '';
              setShowPlaceholder(true);
            }
          }
        },
      }
    );
  };

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.oninput = () => {
        setShowPlaceholder(!commentInputRef.current?.innerText);
      };
    }
  }, [commentInputRef]);

  return (
    <div
      className={cn(
        'w-full relative flex flex-col gap-y-4 p-4 border-neutral-300 bg-white shadow-normal rounded-sm',
        {
          'opacity-50 pointer-events-none': isPending || !blogPostId,
        }
      )}
    >
      {!parentCommentId && (
        <div className="flex gap-x-2 items-center">
          <img
            src={currentUser?.avatarUrl ?? AVATAR_PLACEHOLDER}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium text-sm">
            {currentUser?.fullName ?? 'Surfer'}
          </span>
        </div>
      )}

      <div className="relative w-full">
        <div
          id="comment-input"
          contentEditable
          ref={commentInputRef}
          onFocus={() => {
            if (!currentUser) {
              openAuthModal();
            }
          }}
          className="w-full p-4 rounded-sm resize-none outline-none focus:outline-none z-20"
        />
        {showPlaceholder && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 text-neutral-400 z-10"
            onClick={() => commentInputRef.current?.focus()}
          >
            Comment here...
          </motion.span>
        )}
      </div>
      <div className="flex justify-end">
        <StyledButton
          variant="dark"
          className={cn(
            'px-6 w-auto self-end scale-90 bg-green-500 hover:bg-green-600',
            {
              'opacity-50 pointer-events-none':
                isPending || !blogPostId || !currentUser || showPlaceholder,
            }
          )}
          text={parentCommentId ? 'Reply' : 'Comment'}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default CommentInput;
