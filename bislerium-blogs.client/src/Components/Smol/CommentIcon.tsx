import { MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import AnimatedCounter from '../Reusables/AnimatedCounter';
import { COLORS } from '../../utils/constants';

interface ICommentIconProps {
  size?: number;
  count?: number;
  className?: string;
  onClick?: () => void;
}
const CommentIcon = ({
  size,
  count,
  className,
  onClick,
}: ICommentIconProps) => {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between cursor-pointer',
        className
      )}
      whileHover={{ opacity: 0.9 }}
      animate={{ opacity: 0.7 }}
      onClick={onClick}
    >
      <MessageSquare size={size} color={COLORS.primary} />
      <AnimatedCounter value={count || 0} />
    </motion.div>
  );
};

export default CommentIcon;
