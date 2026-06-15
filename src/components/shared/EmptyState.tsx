'use client';

import React from 'react';
import { Ghost } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState = ({ 
  title, 
  description, 
  icon: Icon = Ghost, 
  className,
  children 
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
        <Icon size={40} weight="duotone" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
};
