import { X } from 'lucide-react';
import CommentInput from './CommentInput';

interface ICommentsProps {
  id?: string;
  isExpanded?: boolean;
}
const Comments = ({ id, isExpanded = false }: ICommentsProps) => {
  return (
    <div className="flex flex-col p-4 w-[28%] min-h-full border-l border-neutral-300 shadow-md bg-white pt-10 gap-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Comments</h2>
        <X size={28} />
      </div>
      <CommentInput />
    </div>
  );
};

export default Comments;
