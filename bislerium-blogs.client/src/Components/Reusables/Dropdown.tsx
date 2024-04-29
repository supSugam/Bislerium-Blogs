import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import StyledText from '../Elements/StyledText';

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  bordered?: boolean;
} & React.HTMLProps<HTMLButtonElement>;

interface IDropdownProps extends React.HTMLProps<HTMLButtonElement> {
  targetComponent: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  takeParentWidth?: boolean;
  open?: boolean;
}
const Dropdown = ({
  targetComponent,
  items,
  takeParentWidth = false,
  position = 'right',
  open,
  ...props
}: IDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClick = () => {
    if (typeof open === 'boolean' || !items.length) return;
    setIsOpen((prev) => !prev);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick(wrapperRef, () => {
    setIsOpen(false);
  });
  const { type, ...rest } = props;

  useEffect(() => {
    if (typeof open === 'boolean') {
      setIsOpen(open);
    }
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={onClick} {...rest}>
        {targetComponent}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 10,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            // className="absolute top-10 right-0 z-50 bg-white shadow-lg rounded-md border border-gray-200 w-56"
            className={cn(
              'absolute z-50 bg-white shadow-lg rounded-md border border-gray-200',
              {
                'right-0': position === 'right',
                'left-0': position === 'left',
                'w-56': !takeParentWidth,
                'w-full': takeParentWidth,
              }
            )}
          >
            <div className="flex flex-col">
              {items.map((item, index) => {
                const { label, icon, bordered, className, type, ...rest } =
                  item;
                return (
                  <motion.button
                    key={index}
                    type={type}
                    onClick={item.onClick}
                    // nice sliding animation
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 10,
                    }}
                    transition={{
                      duration: (index + 1) * 0.1,
                    }}
                    className={cn(
                      'flex items-center gap-x-2 px-3 py-2 w-full text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                      {
                        'border-b border-gray-200':
                          bordered && index !== items.length - 1,
                      },
                      className
                    )}
                    {...rest}
                  >
                    {icon}
                    <StyledText text={label} animate />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
