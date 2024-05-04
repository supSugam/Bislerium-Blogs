import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ITooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  subLabel?: string;
}
export const Tooltip = ({
  label,
  subLabel,
  children,
  className,
  style,
}: ITooltipProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tooltipWidth, setTooltipWidth] = useState<number>(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current) {
      setTooltipWidth(tooltipRef.current.offsetWidth);
    }
  }, [tooltipRef]);

  return (
    <div
      className={cn('relative group', className)}
      key={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, y: 20, scale: 0.6 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -10 : 20,
          scale: isHovered ? 1 : 0.6,
          transition: { type: 'spring', stiffness: 250, damping: 20 },
        }}
        exit={{ opacity: 0, y: 20, scale: 0.6 }}
        style={{
          whiteSpace: 'nowrap',
          position: 'absolute',
          bottom: '100%',
          left: `calc(50% - ${tooltipWidth / 2}px)`,
        }}
        className="flex text-xs flex-col items-center justify-center rounded-md bg-primary bg-opacity-75 shadow-xl px-4 py-2 z-[222]"
      >
        <div className="font-medium text-white relative z-30 text-sm">
          {label}
        </div>
        {subLabel && <div className="text-white text-xs">{subLabel}</div>}
      </motion.div>
      {children}
    </div>
  );
};
