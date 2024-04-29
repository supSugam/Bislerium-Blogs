import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useRef, useState } from 'react';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  bordered?: boolean;
} & React.HTMLProps<HTMLButtonElement>;

interface IDropdownProps extends React.HTMLProps<HTMLButtonElement> {
  targetComponent: React.ReactNode;
  items: DropdownItem[];
}
const Dropdown = ({ targetComponent, items, ...props }: IDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClick = () => {
    setIsOpen((prev) => !prev);
  };

  const optionsWrapperRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick(optionsWrapperRef, () => {
    setIsOpen(false);
  });
  const { type, ...rest } = props;

  return (
    <div className="relative">
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
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="absolute top-10 right-0 z-50 bg-white shadow-lg rounded-md border border-gray-200 w-48"
            ref={optionsWrapperRef}
          >
            <div className="flex flex-col">
              {items.map((item, index) => {
                const { label, icon, bordered, className, type, ...rest } =
                  item;
                return (
                  <button
                    key={index}
                    className={cn(
                      'flex items-center px-4 py-2 w-full text-left',
                      {
                        'border-b border-gray-200': bordered,
                      },
                      className
                    )}
                    {...rest}
                  >
                    {icon && <div className="mr-2">{icon}</div>}
                    {label}
                  </button>
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
