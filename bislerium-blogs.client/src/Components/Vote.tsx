import { useEffect, useState } from 'react';
import { IVotePayload } from '../Interfaces/Models/IVotePayload';
import VoteIcon from '../lib/SVGs/VoteIcon';
import useBlogsQuery from '../hooks/react-query/useBlogsQuery';
import { AnimatePresence } from 'framer-motion';
import AnimatedCounter from './Reusables/AnimatedCounter';
import { motion } from 'framer-motion';
import { ICommentReactions } from '../Interfaces/Models/IComment';
import useCommentsQuery from '../hooks/react-query/useCommentsQuery';
import { cn } from '../utils/cn';
type VoteProps = {
  id: string;
  className?: string;
} & (
  | {
      type?: 'blog';
      initialVoteCounts: IVotePayload;
    }
  | {
      type: 'comment';
      initialVoteCounts: ICommentReactions;
    }
);
const Vote = ({
  initialVoteCounts,
  id,
  type = 'blog',
  className,
}: VoteProps) => {
  const {
    upvoteVlog: {
      mutateAsync: upvoteBlogMutation,
      isPending: upvoteBlogPending,
    },
    downvoteBlog: {
      mutateAsync: downBlogMutation,
      isPending: downvoteBlogPending,
    },
    getBlogVotes: { data: blogVotes },
  } = useBlogsQuery({
    ...(type === 'blog' && id && { id }),
    getAllBlogsConfig: {
      queryOptions: {
        enabled: false,
      },
    },
  });

  const {
    upvoteComment: {
      mutateAsync: upvoteCommentMutation,
      isPending: upvoteCommentPending,
    },
    downvoteComment: {
      mutateAsync: downCommentMutation,
      isPending: downvoteCommentPending,
    },
    getCommentReactions: { data: commentReactions },
  } = useCommentsQuery({
    ...(type === 'comment' && id && { id }),
    getAllCommentsConfig: {
      queryOptions: {
        enabled: false,
      },
    },
  });

  useEffect(() => {
    if (type === 'blog' && blogVotes) {
      setVoteDetails(blogVotes.data.result);
    }
    if (type === 'comment' && commentReactions) {
      setVoteDetails(commentReactions.data.result);
    }
  }, [blogVotes, commentReactions, type]);

  const upvotePending =
    type === 'blog' ? upvoteBlogPending : upvoteCommentPending;
  const downvotePending =
    type === 'blog' ? downvoteBlogPending : downvoteCommentPending;

  const [voteDetails, setVoteDetails] = useState<
    IVotePayload | ICommentReactions
  >(initialVoteCounts);

  const onUpvote = async () => {
    if (upvotePending || downvotePending) return;

    switch (type) {
      case 'blog':
        await upvoteBlogMutation(
          { id },
          {
            onSuccess: (data) => {
              const payload = data.data.result;
              setVoteDetails((prev) => ({ ...prev, ...payload }));
            },
            onError: (error) => {
              console.log(error);
            },
          }
        );
        break;
      case 'comment':
        await upvoteCommentMutation(
          { id },
          {
            onSuccess: (data) => {
              const payload = data.data.result;
              setVoteDetails((prev) => ({ ...prev, ...payload }));
            },
            onError: (error) => {
              console.log(error);
            },
          }
        );
        break;
    }
  };

  const onDownvote = async () => {
    if (upvotePending || downvotePending) return;

    switch (type) {
      case 'blog':
        await downBlogMutation(
          { id },
          {
            onSuccess: (data) => {
              const payload = data.data.result;
              setVoteDetails((prev) => ({ ...prev, ...payload }));
            },
            onError: (error) => {
              console.log(error);
            },
          }
        );
        break;
      case 'comment':
        await downCommentMutation(
          { id },
          {
            onSuccess: (data) => {
              const payload = data.data.result;
              setVoteDetails((prev) => ({ ...prev, ...payload }));
            },
            onError: (error) => {
              console.log(error);
            },
          }
        );
        break;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={cn('flex space-x-1 items-center', className)}
        whileHover={{ opacity: 0.9 }}
        animate={{ opacity: 0.7 }}
      >
        <VoteIcon
          isVoted={voteDetails.isVotedUp}
          type="up"
          onClick={onUpvote}
          disabled={upvotePending || downvotePending}
        />
        <AnimatedCounter value={voteDetails.popularity} />
        <VoteIcon
          isVoted={voteDetails.isVotedDown}
          type="down"
          onClick={onDownvote}
          disabled={upvotePending || downvotePending}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Vote;
