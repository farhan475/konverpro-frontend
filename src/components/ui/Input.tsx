import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all placeholder:text-gray-300',
            error && 'border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
