import { useState } from 'react';
import { IVotePayload } from '../Interfaces/Models/IVotePayload';
import VoteIcon from '../lib/SVGs/VoteIcon';
import useBlogsQuery from '../hooks/react-query/useBlogsQuery';
import { AnimatePresence } from 'framer-motion';
import AnimatedCounter from './Reusables/AnimatedCounter';

interface IVoteProps {
  initialVoteCounts: IVotePayload;
  id: string;
}
const Vote = ({ initialVoteCounts, id }: IVoteProps) => {
  const {
    upvoteVlog: {
      mutateAsync: upvoteBlogMutation,
      isPending: blogUpvotePending,
    },
    downvoteBlog: {
      mutateAsync: downBlogMutation,
      isPending: blogDownvotePending,
    },
  } = useBlogsQuery({});

  const [voteDetails, setVoteDetails] =
    useState<IVotePayload>(initialVoteCounts);

  const onUpvote = async () => {
    if (blogUpvotePending || blogDownvotePending) return;
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
  };

  const onDownvote = async () => {
    if (blogUpvotePending || blogDownvotePending) return;
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
  };

  return (
    <AnimatePresence>
      <div className="flex space-x-1 items-center">
        <VoteIcon
          isVoted={voteDetails.isVotedUp}
          type="up"
          onClick={onUpvote}
          disabled={blogUpvotePending || blogDownvotePending}
        />
        <AnimatedCounter value={voteDetails.popularity} />
        <VoteIcon
          isVoted={voteDetails.isVotedDown}
          type="down"
          onClick={onDownvote}
          disabled={blogUpvotePending || blogDownvotePending}
        />
      </div>
    </AnimatePresence>
  );
};

export default Vote;
