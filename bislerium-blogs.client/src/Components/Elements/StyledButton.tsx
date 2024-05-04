import SpinnerIcon from '../../lib/SVGs/SpinnerIcon';
import { cn } from '../../utils/cn';
import { BottomGradient } from '../Reusables/LabelnputContainer';
import StyledText from './StyledText';
import { AnimatePresence, motion } from 'framer-motion';

interface IStyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text: React.ReactNode;
  isLoading?: boolean;
}

const StyledButton = ({
  className,
  variant,
  size,
  text,
  isLoading = false,
  ...props
}: IStyledButtonProps) => {
  const buttonClassnames = cn(
    'px-5 py-2 rounded-smr relative rounded-md',
    {
      'bg-primary text-white': variant === 'primary',
      'bg-white text-primary border border-primary': variant === 'secondary',
      'bg-neutral-900 relative group/btn from-neutral-700 to-neutral-900 block w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-neutral-700 transition-colors duration-200 ease-in':
        variant === 'dark',
    },
    className,
    'cursor-pointer'
  );

  const textStyles = cn({
    'text-sm': size === 'small',
    'text-base': size === 'medium',
    'text-lg': size === 'large',
    'text-white': variant === 'dark',
  });

  return (
    <AnimatePresence>
      <button
        className={buttonClassnames}
        {...props}
        disabled={props.disabled || isLoading}
      >
        {!isLoading && <StyledText children={text} className={textStyles} />}

        <BottomGradient />
        <motion.div
          initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
          animate={{
            opacity: isLoading ? 1 : 0,
            scale: isLoading ? 1 : 0,
            x: '-50%',
            y: '-50%',
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-1/2 left-1/2"
          key={isLoading ? 'spinner' : 'text'}
        >
          <SpinnerIcon size={20} fill="#fff" />
        </motion.div>
      </button>
    </AnimatePresence>
  );
};

export default StyledButton;
