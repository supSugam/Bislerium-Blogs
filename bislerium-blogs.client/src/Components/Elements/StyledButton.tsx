import { cn } from '../../utils/cn';
import StyledText from './StyledText';
interface IStyledButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text: string;
}

const StyledButton = ({
  className,
  variant,
  size,
  text,
  ...props
}: IStyledButtonProps) => {
  const buttonClassnames = cn(
    'px-4 py-2 rounded-md',
    {
      'bg-primary text-white': variant === 'primary',
      'bg-white text-primary border border-primary': variant === 'secondary',
    },
    className
  );

  const textStyles = cn({
    'text-sm': size === 'small',
    'text-base': size === 'medium',
    'text-lg': size === 'large',
  });

  return (
    <button className={buttonClassnames} {...props}>
      <StyledText text={text} className={textStyles} />
    </button>
  );
};

export default StyledButton;
