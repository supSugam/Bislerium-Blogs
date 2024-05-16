import {
  useState,
  useEffect,
  FC,
  ReactNode,
  useCallback,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  backdropClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  backgroundClassName?: string;
}

const Modal: FC<ModalProps> = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      children,
      className,
      backdropClassName,
      backgroundClassName,
      closeOnBackdropClick = true,
      closeOnEscapeKey = true,
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        onClose?.();
        document.body.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
      }
    }, [isOpen, onClose, setMounted]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
          onClose?.();
        }
      },
      [onClose, closeOnBackdropClick]
    );

    const [zIndex, setZIndex] = useState<number>(333);

    useEffect(() => {
      if (!isOpen) return;
      const highestZIndex = Array.from(
        document.querySelectorAll('.modal-container')
      )
        .map((modal) => parseInt(getComputedStyle(modal).zIndex))
        .sort((a, b) => b - a)[0];

      setZIndex((highestZIndex ?? 333) + 1);
    }, [isOpen, setZIndex]);

    const modalContent = (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'modal-container',
              'fixed inset-0 flex items-center justify-center',
              backdropClassName
            )}
            style={{ zIndex }}
            onKeyDown={(e: React.KeyboardEvent) =>
              e.key === 'Escape' && closeOnEscapeKey && onClose?.()
            }
          >
            {/* White transculent glass background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              className={cn(
                'fixed inset-0 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm',
                backgroundClassName
              )}
              onClick={handleBackdropClick}
            />
            {children && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                  'relative max-w-xl mx-auto bg-white backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8',
                  className
                )}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
  }
);

export default Modal;
