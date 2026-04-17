'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './form';

interface ConfirmProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onClose,
}: ConfirmProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            variant === 'danger' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
          }`}
        >
          <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
      </div>
    </Modal>
  );
}
