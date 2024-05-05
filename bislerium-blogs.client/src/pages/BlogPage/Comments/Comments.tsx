import { useEffect, useMemo } from 'react';
import Modal from '../../../Components/Modal/Modal';
import useCommentsQuery from '../../../hooks/react-query/useCommentsQuery';
import Comment from './Comment';
import CommentInput from './CommentInput';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCommentsStore } from '../../../services/stores/useCommentsStore';
interface ICommentsProps {
  id?: string;
  isExpanded: boolean;
  onClose?: () => void;
}
const Comments = ({ id, isExpanded, onClose }: ICommentsProps) => {
  const { setComments, comments, getCommentsCount } = useCommentsStore();

  const getAllCommentsConfig = useMemo(
    () => ({
      params: {
        includeReplies: true,
      },
      blogPostId: id,
    }),
    [id]
  );
  const {
    getComments: { data: commentsData, isLoading: isCommentsLoading },
  } = useCommentsQuery({
    getAllCommentsConfig,
  });

  useEffect(() => {
    if (!id) return;
    setComments(id, commentsData?.data?.result ?? []);
  }, [commentsData, id, setComments]);

  return (
    <>
      <Modal
        isOpen={isExpanded}
        onClose={onClose}
        backgroundClassName="backdrop-blur-none bg-black bg-opacity-20"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isExpanded ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-0 top-0 flex flex-col p-4 px-6 w-11/12 sm:w-10/12 md:w-1/2 lg:w-[35%] xl:w-1/4 min-h-full max-h-full border-l border-neutral-300 shadow-ld bg-white pt-10 gap-y-4 overflow-x-hidden  overflow-y-scroll z-[334]"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-medium">
            {`Comments (${getCommentsCount(id, true)})`}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center shadow-sm bg-neutral-200 bg-opacity-40 hover:bg-opacity-80 transition-all cursor-pointer duration-150 p-2 rounded-full hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>
        <CommentInput blogPostId={id} />
        <div className="w-full h-[1px] bg-neutral-200 my-6" />

        {!isCommentsLoading && id ? (
          comments[id].map((comment) => (
            <Comment key={comment.commentId} comment={comment} />
          ))
        ) : (
          <div className="flex justify-center items-center h-96">
            <p>Loading Comments...</p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Comments;
