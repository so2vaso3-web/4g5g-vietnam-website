'use client';

import * as React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand-soft text-brand-300">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary sm:text-lg">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
