import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullHeight?: boolean;
}

const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fullHeight, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = useState<boolean>(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const [inputType, setInputType] = useState<string>(type ?? 'text');
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? radius + 'px' : '0px'
            } circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input relative h-full"
      >
        <div className="relative w-full h-full">
          <input
            type={inputType}
            className={cn(
              `flex bg-neutral-100 h-10 w-full border-none shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none transition duration-400
           `,
              className,
              fullHeight && 'h-full'
            )}
            ref={ref}
            {...props}
          />

          <motion.div
            className="absolute top-1/2 right-2 cursor-pointer"
            onClick={() => {
              setInputType((prev) =>
                prev === 'password' ? 'text' : 'password'
              );
            }}
            initial={{ opacity: 0, scale: 0, y: '-50%' }}
            animate={{ opacity: 1, scale: type === 'password' ? 1 : 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            key={type}
          >
            {inputType === 'password' ? (
              <EyeIcon size={18} />
            ) : (
              <EyeOffIcon size={18} />
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);
StyledInput.displayName = 'Input';

export default StyledInput;
