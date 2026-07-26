'use client';

import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';
import * as React from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: React.ReactNode;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const config: Record<ToastType, { icon: React.ReactNode; ring: string; bar: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" strokeWidth={2} />,
    ring: 'ring-emerald-500/30',
    bar: 'from-emerald-500 to-cyan-500',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-400" strokeWidth={2} />,
    ring: 'ring-red-500/30',
    bar: 'from-red-500 to-orange-500',
  },
  info: {
    icon: <Info className="h-5 w-5 text-sky-400" strokeWidth={2} />,
    ring: 'ring-sky-500/30',
    bar: 'from-brand-500 to-accent',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-400" strokeWidth={2} />,
    ring: 'ring-amber-500/30',
    bar: 'from-amber-500 to-orange-500',
  },
};

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  React.useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { icon, ring, bar } = config[type];

  return (
    <div className="pointer-events-auto fixed left-1/2 top-6 z-[120] w-[min(90vw,420px)] -translate-x-1/2 animate-fade-in-down">
      <div
        className={`glass-strong relative overflow-hidden rounded-2xl px-4 py-3 shadow-card ring-1 ${ring}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icon}</div>
          <div className="flex-1 text-sm text-text-primary">{message}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div
          className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${bar} animate-[shrink_3s_linear_forwards]`}
        />
        <style jsx>{`
          @keyframes shrink {
            from {
              transform: scaleX(1);
              transform-origin: left;
            }
            to {
              transform: scaleX(0);
              transform-origin: left;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
