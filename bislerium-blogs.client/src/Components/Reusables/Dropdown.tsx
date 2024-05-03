import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import StyledText from '../Elements/StyledText';

type DropdownItem = {
  icon?: React.ReactNode;
  bordered?: boolean;
} & React.HTMLProps<HTMLDivElement> &
  (
    | {
        label: string;
        element?: never;
      }
    | {
        element: React.ReactNode;
        label?: never;
      }
  );

interface IDropdownProps extends React.HTMLProps<HTMLDivElement> {
  targetComponent: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  takeParentWidth?: boolean;
  open?: boolean;
  closeOnClick?: boolean;
  takeFullWidth?: boolean;
  gap?: number;
}
const Dropdown = ({
  targetComponent,
  items,
  takeParentWidth = false,
  position = 'right',
  open,
  closeOnClick = true,
  takeFullWidth = false,
  gap = 10,
  ...props
}: IDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClick = () => {
    if (typeof open === 'boolean') return;
    setIsOpen(true);
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
    <div
      className={cn('relative', {
        'w-full': takeFullWidth,
      })}
      ref={wrapperRef}
    >
      <div role="button" onClick={onClick} {...rest}>
        {targetComponent}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: gap,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.1,
            }}
            // className="absolute top-10 right-0 z-50 bg-white shadow-lg rounded-md border border-gray-200 w-56"
            className={cn(
              'absolute z-50 bg-white shadow-md rounded-md border border-gray-200',
              {
                'right-0': position === 'right',
                'left-0': position === 'left',
                'w-56': !takeParentWidth,
                'w-full': takeParentWidth,
              }
            )}
          >
            <div className="flex flex-col">
              {items.map(
                (
                  { label, icon, bordered, className, element, onClick },
                  index
                ) => {
                  return (
                    <motion.div
                      role="button"
                      key={index}
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
                        'flex items-center gap-x-2 px-3 py-2 w-full text-left focus:outline-none focus:bg-gray-100',
                        {
                          'border-b border-gray-200':
                            bordered && index !== items.length - 1,
                          'hover:bg-gray-100 transition duration-300': !!label,
                        },
                        className
                      )}
                      onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => {
                        if (closeOnClick) {
                          setIsOpen(false);
                        }
                        onClick?.(e);
                      }}
                    >
                      {label ? (
                        <>
                          {icon}
                          <StyledText children={label} animate />
                        </>
                      ) : (
                        element
                      )}
                    </motion.div>
                  );
                }
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
