import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div 
      className={cn('bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5', className)} 
      {...props}
    >
      {children}
    </div>
  );
};
