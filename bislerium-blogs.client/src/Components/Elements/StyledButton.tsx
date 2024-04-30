import { cn } from '../../utils/cn';
import { BottomGradient } from '../Reusables/LabelnputContainer';
import StyledText from './StyledText';
interface IStyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text: React.ReactNode;
}

const StyledButton = ({
  className,
  variant,
  size,
  text,
  ...props
}: IStyledButtonProps) => {
  const buttonClassnames = cn(
    'px-4 py-2 rounded-sm',
    {
      'bg-primary text-white': variant === 'primary',
      'bg-white text-primary border border-primary': variant === 'secondary',
      'bg-gradient-to-br relative group/btn from-neutral-700 to-neutral-900 block w-full text-white h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]':
        variant === 'dark',
    },
    className,
    'cursor-pointer '
  );

  const textStyles = cn({
    'text-sm': size === 'small',
    'text-base': size === 'medium',
    'text-lg': size === 'large',
    'text-white': variant === 'dark',
  });

  return (
    <button className={buttonClassnames} {...props}>
      <StyledText children={text} className={textStyles} />
      <BottomGradient />
    </button>
  );
};

export default StyledButton;
