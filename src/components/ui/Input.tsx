'use client';

import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, className = '', ...rest }, ref) => {
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
          <input
            ref={ref}
            className={[
              'w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-text-primary transition-all duration-200 placeholder:text-text-secondary/70',
              'focus:outline-none focus:border-brand-500/60 focus:ring-4 focus:ring-brand-500/15 focus:bg-white/[0.07]',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              error ? 'border-danger/60' : 'border-border',
              className,
            ].join(' ')}
            style={{ minHeight: 44 }}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-3 flex items-center text-text-secondary">
              {rightIcon}
            </span>
          )}
        </div>
        {hint && !error && <p className="mt-1.5 text-xs text-text-secondary">{hint}</p>}
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
