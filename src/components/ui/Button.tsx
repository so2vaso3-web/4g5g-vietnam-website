'use client';

import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0';

const variantStyles: Record<Variant, string> = {
  primary:
    'text-white shadow-glow-blue hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(37,99,235,0.8)] active:translate-y-0',
  secondary:
    'bg-white/5 text-text-primary border border-border-strong hover:bg-white/10 hover:border-white/25',
  ghost: 'bg-transparent text-text-primary hover:bg-white/5 border border-transparent',
  danger:
    'text-white shadow-[0_8px_30px_-8px_rgba(239,68,68,0.6)] hover:-translate-y-0.5',
  success:
    'text-[#04111a] shadow-[0_8px_30px_-8px_rgba(34,197,94,0.55)] hover:-translate-y-0.5',
  outline:
    'bg-transparent text-text-primary border border-brand-500/40 hover:bg-brand-500/10 hover:border-brand-500/70',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

const variantGradient: Record<Variant, string> = {
  primary: 'bg-gradient-brand',
  secondary: '',
  ghost: '',
  danger: 'bg-gradient-to-r from-red-500 to-orange-500',
  success: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
  outline: '',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      leftIcon,
      rightIcon,
      fullWidth,
      className = '',
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          variantGradient[variant],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          leftIcon && <span className="inline-flex">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = 'Button';
