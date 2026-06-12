import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'ai';
}

export const Badge = ({ children, className, variant = 'neutral', ...props }: BadgeProps) => {
  const variants = {
    success: 'bg-green-50 text-green-700 border-green-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    ai: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
