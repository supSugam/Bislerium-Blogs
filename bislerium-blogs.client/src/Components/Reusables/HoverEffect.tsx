import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { cn } from '../../utils/cn';

const HoverEffect = ({
  children,
  className,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = useState<boolean>(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={
        !disabled
          ? {
              background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? radius + 'px' : '0px'
            } circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
            }
          : {}
      }
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      // className="p-[2px] rounded-md transition duration-300 group/input relative h-full w-full"
      className={cn(
        'p-[2px] rounded-md transition duration-300 group/input relative h-full w-full',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default HoverEffect;
