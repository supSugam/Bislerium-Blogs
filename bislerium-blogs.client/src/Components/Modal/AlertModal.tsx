import React from 'react';
import Modal from './Modal';
import { cn } from '../../utils/cn';
import UnsaveWarnIcon from '../../lib/SVGs/UnsaveWarnIcon';
import DeleteIcon from '../../lib/SVGs/DeleteIcon';
import SuccessIcon from '../../lib/SVGs/SuccessIcon';

interface ModalProps {
  title: string;
  subtitle: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  type: 'success' | 'warn' | 'danger' | 'info';
  icon?: React.ReactNode;
}

const AlterModal: React.FC<ModalProps> = ({
  title,
  subtitle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  type,
  icon,
}) => {
  const cancelBtnClassnames = cn(
    'flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400',
    {
      hidden: type === 'info',
    }
  );

  const confirmBtnClassnames = cn(
    'flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all focus:ring  disabled:cursor-not-allowed',
    {
      'bg-red-500 hover:border-red-700 hover:bg-red-700 border-red-500 focus:ring-red-200 disabled:bg-red-300 disabled:border-red-300':
        type === 'danger',
      'bg-green-500 hover:border-green-700 hover:bg-green-700 border-green-500 focus:ring-green-200 disabled:bg-green-300 disabled:border-green-300':
        type === 'success',
      'bg-yellow-500 hover:border-yellow-700 hover:bg-yellow-700 border-yellow-500 focus:ring-yellow-200 disabled:bg-yellow-300 disabled:border-yellow-300':
        type === 'warn',
      'bg-blue-500 hover:border-blue-700 hover:bg-blue-700 border-blue-500 focus:ring-blue-200 disabled:bg-blue-300 disabled:border-blue-300':
        type === 'info',
    }
  );

  const iconWrapperClassnames = cn(
    'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full',
    {
      'bg-red-100 text-red-500': type === 'danger',
      'bg-green-100 text-green-500': type === 'success',
      'bg-yellow-100 text-yellow-500': type === 'warn',
      'bg-blue-100 text-blue-500': type === 'info',
    }
  );

  const modalIcon = icon
    ? icon
    : {
        warn: <UnsaveWarnIcon size={24} />,
        danger: <DeleteIcon size={24} />,
        success: <SuccessIcon size={24} />,
        info: <></>,
      }[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl max-w-[90%] sm:max-w-sm border-neutral-200 border"
    >
      <div className="relative">
        <div className="text-center">
          <div className={iconWrapperClassnames}>{modalIcon}</div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
            <div className="mt-2 text-sm text-secondary-500">{subtitle}</div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className={cancelBtnClassnames}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={confirmBtnClassnames}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlterModal;
