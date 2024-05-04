import { motion, AnimatePresence } from 'framer-motion';

interface IVoteIconProps {
  isVoted: boolean;
  type: 'up' | 'down';
  size?: number;
  onClick?: () => void;
}

const VoteIcon = ({ size = 24, isVoted, type, onClick }: IVoteIconProps) => {
  const iconColor = isVoted ? '#FF4500' : 'currentColor'; // Change color when voted

  return (
    <AnimatePresence>
      <motion.button
        key="vote-icon"
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.1 }}
      >
        <svg
          fill={iconColor}
          height={size}
          viewBox="0 0 20 20"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {type === 'up' ? (
            <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z" />
          ) : (
            <path d="M12.877 1H7.123A1.125 1.125 0 0 0 6 2.123V9H2.126a1.114 1.114 0 0 0-1.007.7 1.249 1.249 0 0 0 .171 1.343L9.166 19.632a1.128 1.128 0 0 0 1.668-.004l7.872-8.581a1.25 1.25 0 0 0 .176-1.348 1.113 1.113 0 0 0-1.005-.7H14V2.123A1.125 1.125 0 0 0 12.877 1ZM7.25 2.25h5.5v8h4.934L10 18.69 2.258 10.25H7.25v-8ZM2.227 10.216l-.012-.016c.01.006.014.01.012.016Z" />
          )}
        </svg>
      </motion.button>
    </AnimatePresence>
  );
};

export default VoteIcon;
