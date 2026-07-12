'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, leftIcon, className = '', children, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
              {leftIcon}
            </span>
          )}
          <select
            ref={ref}
            className={[
              'w-full appearance-none rounded-xl border bg-white/5 px-4 py-2.5 pr-10 text-sm text-text-primary transition-all duration-200',
              'focus:outline-none focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/15',
              leftIcon ? 'pl-10' : '',
              error ? 'border-danger/60' : 'border-border',
              className,
            ].join(' ')}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.85rem center',
              backgroundSize: '16px 16px',
              minHeight: 44,
            }}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        </div>
        {hint && !error && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
