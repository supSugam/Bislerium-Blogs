import VoteIcon from '../lib/SVGs/VoteIcon';
import StyledText from './Elements/StyledText';

interface IVoteProps {
  voteCount: number;
  onUpVote: () => void;
  onDownVote: () => void;
  isVotedUp: boolean;
  isVotedDown: boolean;
}
const Vote = ({
  voteCount,
  onUpVote,
  onDownVote,
  isVotedUp,
  isVotedDown,
}: IVoteProps) => {
  return (
    <div className="flex space-x-1 items-center">
      <VoteIcon isVoted={isVotedUp} type="up" onClick={onUpVote} />
      <StyledText>{voteCount}</StyledText>
      <VoteIcon isVoted={isVotedDown} type="down" onClick={onDownVote} />
    </div>
  );
};

export default Vote;
