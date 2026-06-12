import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-900 text-white hover:bg-blue-700',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger: 'bg-white border border-red-200 text-red-600 hover:bg-red-50',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
