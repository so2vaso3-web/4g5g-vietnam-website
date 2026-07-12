'use client';

import * as React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import Modal from './ui/Modal';
import { Button } from './ui/Button';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}

const TYPE_CONFIG: Record<NonNullable<AlertModalProps['type']>, {
  icon: React.ReactNode;
  ring: string;
  iconClass: string;
  variant: 'primary' | 'success' | 'danger' | 'secondary';
}> = {
  info: {
    icon: <Info className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-sky-400/30',
    iconClass: 'text-sky-300 bg-sky-500/15',
    variant: 'primary',
  },
  success: {
    icon: <CheckCircle2 className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-emerald-400/30',
    iconClass: 'text-emerald-300 bg-emerald-500/15',
    variant: 'success',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-amber-400/30',
    iconClass: 'text-amber-300 bg-amber-500/15',
    variant: 'primary',
  },
  error: {
    icon: <XCircle className="h-6 w-6" strokeWidth={1.8} />,
    ring: 'ring-red-400/30',
    iconClass: 'text-red-300 bg-red-500/15',
    variant: 'danger',
  },
};

const DEFAULT_TITLE: Record<string, string> = {
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  info: 'Thông báo',
};

export default function AlertModal({
  isOpen,
  message,
  title,
  type = 'info',
  onClose,
}: AlertModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    if (type !== 'info' && type !== 'success') return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;
  const cfg = TYPE_CONFIG[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${cfg.ring} ${cfg.iconClass}`}
          >
            {cfg.icon}
          </span>
          <span>{title ?? DEFAULT_TITLE[type]}</span>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button variant={cfg.variant} onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
    </Modal>
  );
}
