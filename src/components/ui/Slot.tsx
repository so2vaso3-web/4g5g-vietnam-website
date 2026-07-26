'use client';

import * as React from 'react';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * Minimal Slot that forwards props to its single child.
 * Used by Toast / Modal when we need a polymorphic element.
 */
export function Slot({ children, ...props }: SlotProps) {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<any>;
  return React.cloneElement(child, { ...props, ...(child.props ?? {}) });
}
