'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { WarningCircle } from '@phosphor-icons/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) => {
  const variantStyles = {
    danger: {
      icon: 'bg-red-50 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'bg-orange-50 text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    primary: {
      icon: 'bg-blue-50 text-blue-900',
      button: 'bg-blue-900 hover:bg-blue-700 text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center py-4">
        <div
          className={`w-14 h-14 rounded-2xl ${styles.icon} flex items-center justify-center mx-auto mb-5`}
        >
          <WarningCircle size={28} weight="bold" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">{message}</p>

        <div className="flex items-center gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isLoading}
            className={`min-w-[100px] ${styles.button}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
