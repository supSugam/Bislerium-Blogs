import { cn } from '../../utils/cn';
import StyledLabel from '../Elements/StyledLabel';
import { AnimatePresence, motion } from 'framer-motion';
const LabelInputContainer = ({
  children,
  className,
  htmlFor,
  label,
  errorMessage,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
  label?: string;
  errorMessage?: string;
}) => {
  return (
    <AnimatePresence>
      <div className={cn('flex flex-col space-y-2 w-full', className)}>
        <StyledLabel htmlFor={htmlFor}>{label}</StyledLabel>

        {children}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: errorMessage ? 1 : 0,
            y: errorMessage ? -5 : -10,
          }}
          className="text-red-500 text-sm pb-1"
          key={errorMessage}
        >
          {errorMessage}
        </motion.span>
      </div>
    </AnimatePresence>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export { LabelInputContainer, BottomGradient };
