import ProfileWithName from '../../../Components/Profile/ProfileWithName';
import StyledButton from '../../../Components/Elements/StyledButton';

const CommentInput = () => {
  return (
    <div className="w-full flex flex-col gap-y-4 shadow-sm p-4 border-neutral-300 bg-white">
      <ProfileWithName name="John Doe" subtitle="Software Engineer" />
      <textarea
        placeholder="Write a comment..."
        className="w-full h-24 p-4 border border-neutral-300 rounded-lg resize-none focus:outline-none"
        maxLength={200}
        minLength={10}
      />
      <div className="flex justify-end">
        <StyledButton variant="dark" className="px-6" text="Comment" />
      </div>
    </div>
  );
};

export default CommentInput;
