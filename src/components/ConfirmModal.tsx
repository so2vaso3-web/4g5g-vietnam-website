'use client';

import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import Modal from './ui/Modal';
import { Button } from './ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  title?: string;
  type?: 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const TYPE_CONFIG: Record<NonNullable<ConfirmModalProps['type']>, {
  icon: React.ReactNode;
  ring: string;
  iconClass: string;
}> = {
  info: {
    icon: <Info className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-sky-400/30',
    iconClass: 'text-sky-300 bg-sky-500/15',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-amber-400/30',
    iconClass: 'text-amber-300 bg-amber-500/15',
  },
  danger: {
    icon: <ShieldAlert className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-red-400/30',
    iconClass: 'text-red-300 bg-red-500/15',
  },
};

export default function ConfirmModal({
  isOpen,
  message,
  title,
  type = 'warning',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  const cfg = TYPE_CONFIG[type];
  const resolvedTitle = title ?? (type === 'danger' ? 'Xác nhận xóa' : 'Xác nhận');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      title={
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${cfg.ring} ${cfg.iconClass}`}
          >
            {cfg.icon}
          </span>
          <span>{resolvedTitle}</span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
    </Modal>
  );
}
