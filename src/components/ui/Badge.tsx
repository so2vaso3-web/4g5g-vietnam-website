'use client';

import * as React from 'react';

type Variant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  brand: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/30',
  neutral: 'bg-white/5 text-text-secondary border border-white/10',
};

export default function Badge({ variant = 'brand', children, className = '', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
