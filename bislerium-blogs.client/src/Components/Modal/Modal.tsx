import { useState, useEffect, FC, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  backdropClassName,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      onClose?.();
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && closeOnBackdropClick) {
        onClose?.();
      }
    },
    [onClose, closeOnBackdropClick]
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'fixed inset-0 z-[999] flex items-center justify-center',
            backdropClassName
          )}
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
            className="fixed inset-0 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
              'relative max-w-xl mx-auto bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8',
              className
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default Modal;
