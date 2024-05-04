import { motion } from 'framer-motion';

interface IVoteIconProps {
  isVoted: boolean;
  type: 'up' | 'down';
  size?: number;
  onClick?: () => void;
  disabled?: boolean;
}

const VoteIcon = ({
  size = 16,
  isVoted,
  type,
  onClick,
  disabled,
}: IVoteIconProps) => {
  const iconColor = isVoted ? 'var(--color-primary)' : 'currentColor';

  return (
    <motion.button
      key="vote-icon"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      disabled={disabled}
    >
      <svg
        fill={iconColor}
        height={size}
        viewBox="0 0 20 20"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'up' ? (
          <>
            {isVoted ? (
              <path d="M18.706 8.953 10.834.372A1.123 1.123 0 0 0 10 0a1.128 1.128 0 0 0-.833.368L1.29 8.957a1.249 1.249 0 0 0-.171 1.343 1.114 1.114 0 0 0 1.007.7H6v6.877A1.125 1.125 0 0 0 7.123 19h5.754A1.125 1.125 0 0 0 14 17.877V11h3.877a1.114 1.114 0 0 0 1.005-.7 1.251 1.251 0 0 0-.176-1.347Z" />
            ) : (
              <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z" />
            )}
          </>
        ) : (
          <>
            {isVoted ? (
              <path d="M18.706 11.047 10.834 19.628A1.123 1.123 0 0 1 10 20a1.128 1.128 0 0 1-.833-.368L1.29 11.043a1.249 1.249 0 0 1-.171-1.343 1.114 1.114 0 0 1 1.007-.7H6V2.38A1.125 1.125 0 0 1 7.123 1h5.754A1.125 1.125 0 0 1 14 2.123V9h3.877a1.114 1.114 0 0 1 1.005.7 1.251 1.251 0 0 1-.176 1.347Z" />
            ) : (
              <path d="M12.877 1H7.123A1.125 1.125 0 0 0 6 2.123V9H2.126a1.114 1.114 0 0 0-1.007.7 1.249 1.249 0 0 0 .171 1.343L9.166 19.632a1.128 1.128 0 0 0 1.668-.004l7.872-8.581a1.25 1.25 0 0 0 .176-1.348 1.113 1.113 0 0 0-1.005-.7H14V2.123A1.125 1.125 0 0 0 12.877 1ZM7.25 2.25h5.5v8h4.934L10 18.69 2.258 10.25H7.25v-8ZM2.227 10.216l-.012-.016c.01.006.014.01.012.016Z" />
            )}
          </>
        )}
      </svg>
    </motion.button>
  );
};

export default VoteIcon;
