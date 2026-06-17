'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { StatusPendaftar } from '@/lib/types';

interface StatusBadgeProps {
  status: StatusPendaftar;
  className?: string;
  pulse?: boolean;
}

const statusConfig: Record<StatusPendaftar, { bg: string; text: string; border: string; pulse?: boolean }> = {
  'Baru': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
  'AI Processing': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    pulse: true,
  },
  'Review Akademik': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    pulse: true,
  },
  'Pending Kaprodi': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    pulse: true,
  },
  'Revisi': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  'Approved': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  'Rejected': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

export const StatusBadge = ({ status, className, pulse }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig['Baru'];
  const shouldPulse = pulse ?? config.pulse;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all',
        config.bg,
        config.text,
        config.border,
        shouldPulse && 'animate-pulse',
        className,
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          config.text.replace('text-', 'bg-'),
        )}
      />
      {status}
    </span>
  );
};
