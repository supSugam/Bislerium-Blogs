import { motion } from 'framer-motion';
import SpinnerIcon from '../../lib/SVGs/SpinnerIcon';
import { cn } from '../../utils/cn';

interface ISpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  size?: number;
  fill?: string;
}
const Spinner = ({
  isLoading = false,
  size = 20,
  fill = '#fff',
  ...props
}: ISpinnerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: '-50%' }}
      animate={{
        opacity: isLoading ? 1 : 0,
        scale: isLoading ? 1 : 0,
        y: '-50%',
      }}
      transition={{ duration: 0.2 }}
      key={isLoading ? 'spinner' : 'text'}
      className={cn('absolute', props.className)}
      style={{ ...props.style }}
    >
      <SpinnerIcon size={size} fill={fill} />
    </motion.div>
  );
};

export default Spinner;
