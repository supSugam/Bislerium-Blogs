import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface StyledTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
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
  children,
  className,
  as = 'span',
  animate = false,
  animationDelay = 0,
  transition = { duration: 2, ease: 'easeInOut' },
  ...props
}) => {
  const Tag = as;

  return (
    <Tag className={cn('text-base', className)} {...props}>
      {children}
    </Tag>
  );
};

export default StyledText;
