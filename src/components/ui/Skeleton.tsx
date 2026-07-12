'use client';

import * as React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const radiusMap = {
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export default function Skeleton({ className = '', rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 ${radiusMap[rounded]} ${className}`}
    >
      <div className="absolute inset-0 shimmer-bg" />
    </div>
  );
}
