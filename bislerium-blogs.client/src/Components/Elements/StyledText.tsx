import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface StyledTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  animate?: boolean;
  animationDelay?: number;
  transition?: {
    duration: number;
    ease: string;
  };
}

const StyledText: React.FC<StyledTextProps> = ({
  text,
  className,
  as = 'span',
  animate = false,
  animationDelay = 0,
  transition = { duration: 2, ease: 'easeInOut' },
  ...props
}) => {
  const Tag = as;

  const hoverVariants = {
    hover: {
      x: 3,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={animate ? 'visible' : 'hidden'}
      transition={{ delay: animationDelay, ...transition }}
      whileHover="hover"
    >
      <motion.div variants={hoverVariants}>
        <Tag className={cn('text-base', className)} {...props}>
          {text}
        </Tag>
      </motion.div>
    </motion.div>
  );
};

export default StyledText;
