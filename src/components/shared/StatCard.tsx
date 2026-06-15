'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { IconProps } from '@phosphor-icons/react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType<IconProps>;
  variant?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'orange';
  className?: string;
}

export const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  variant = 'blue', 
  className 
}: StatCardProps) => {
  const variants = {
    blue: 'border-blue-900',
    yellow: 'border-yellow',
    green: 'border-green',
    red: 'border-red',
    purple: 'border-purple',
    orange: 'border-orange',
  };

  const iconColors = {
    blue: 'bg-blue-50 text-blue-900',
    yellow: 'bg-yellow-bg text-yellow',
    green: 'bg-green/10 text-green',
    red: 'bg-red/10 text-red',
    purple: 'bg-purple/10 text-purple',
    orange: 'bg-orange/10 text-orange',
  };

  return (
    <div className={cn(
      "bg-white border-l-4 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      variants[variant],
      className
    )}>
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconColors[variant])}>
          <Icon size={24} weight="bold" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
