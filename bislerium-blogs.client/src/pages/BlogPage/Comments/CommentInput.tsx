import StyledButton from '../../../Components/Elements/StyledButton';
import { useAuthStore } from '../../../services/stores/useAuthStore';
import useCommentsQuery from '../../../hooks/react-query/useCommentsQuery';
import { createRef, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { motion } from 'framer-motion';
import { AVATAR_PLACEHOLDER } from '../../../utils/constants';
import { isSameInnerHtml } from '../../../utils/string';

type CommentInputProps = {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCommentSubmit?: () => void;
  onBlur?: () => void;
} & (
  | {
      mode: 'comment';
      blogPostId: string;
      commentId?: undefined;
      parentCommentId?: undefined;
      comment?: undefined;
    }
  | {
      mode: 'edit';
      commentId: string;
      blogPostId?: undefined;
      comment: string;
      parentCommentId?: undefined;
    }
  | {
      parentCommentId: string;
      mode: 'reply';
      blogPostId: string;
      commentId?: undefined;
      comment?: undefined;
    }
);

const CommentInput = ({
  blogPostId,
  parentCommentId,
  onCommentSubmit,
  mode = 'comment',
  commentId,
  comment,
  onBlur,
}: CommentInputProps) => {
  const { currentUser, openAuthModal } = useAuthStore();
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);
  const commentInputRef = createRef<HTMLDivElement>();
  const {
    publishComment: { mutateAsync: publishCommentMutation, isPending },
    updateComment: { mutateAsync: updateCommentMutation },
  } = useCommentsQuery({});

  const onSuccess = () => {
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
  };

  const onSubmit = async () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    const body = commentInputRef.current?.innerHTML;
    if (!body) return;

    if ((mode === 'comment' || mode === 'reply') && blogPostId) {
      onCommentSubmit?.();
      await publishCommentMutation(
        {
          body,
          blogPostId,
          parentCommentId:
            mode === 'reply' && parentCommentId ? parentCommentId : null,
        },
        {
          onSuccess,
        }
      );
    }

    if (mode === 'edit' && commentId) {
      if (body === comment) return;
      onCommentSubmit?.();
      await updateCommentMutation(
        {
          body,
          id: commentId,
        },
        {
          onSuccess,
        }
      );
    }
  };

  useEffect(() => {
    const current = commentInputRef.current;
    current?.focus();
    const handleInput = () => {
      if (current) {
        setDisabled(isSameInnerHtml(current.innerHTML, comment ?? ''));
        setShowPlaceholder(current.textContent === '');
      }
    };

    if (current) {
      current.oninput = handleInput;
      if (onBlur) {
        // current.addEventListener('blur', onBlur);
      }
    }

    return () => {
      if (current) {
        current.oninput = null;
        if (onBlur) {
          // current.removeEventListener('blur', onBlur);
        }
      }
    };
  }, [commentInputRef, comment, onBlur]);

  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    setDisabled(
      isPending ||
        !currentUser ||
        showPlaceholder ||
        (mode === 'edit' && commentInputRef.current?.innerHTML === comment)
    );
  }, [comment, currentUser, isPending, mode, showPlaceholder, commentInputRef]);

  useEffect(() => {
    if (commentInputRef.current) {
      if (mode === 'edit' && comment) {
        commentInputRef.current.innerHTML = comment;
        setShowPlaceholder(false);
      } else {
        commentInputRef.current.textContent = '';
        setShowPlaceholder(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, comment]);

  return (
    <div
      className={cn(
        'w-full relative flex flex-col gap-y-4 p-4 border-neutral-300 bg-white shadow-normal rounded-sm',
        {
          'opacity-50 pointer-events-none': isPending,
        }
      )}
    >
      {mode === 'comment' && (
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
          // onFocus={() => {
          //   if (!currentUser) {
          //     openAuthModal();
          //   }
          // }}
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
      <div className="flex justify-end gap-x-3 items-center">
        {mode === 'edit' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.8,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ opacity: 1 }}
            className="text-neutral-600 cursor-pointer"
            onClick={() => {
              if (commentInputRef.current && comment) {
                commentInputRef.current.innerHTML = comment;
                onCommentSubmit?.();
              }
              setShowPlaceholder(false);
            }}
          >
            Cancel
          </motion.span>
        )}
        <StyledButton
          variant="dark"
          className={cn(
            'px-6 w-auto self-end scale-90 bg-green-600 hover:bg-green-700',
            {
              'disabled opacity-60': disabled,
            }
          )}
          text={
            mode === 'edit' ? 'Update' : mode === 'reply' ? 'Reply' : 'Comment'
          }
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default CommentInput;
