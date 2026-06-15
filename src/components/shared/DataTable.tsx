'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

interface DataTableProps<T> {
  columns: {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
  }[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  loading, 
  onRowClick,
  emptyTitle = "Belum Ada Data",
  emptyDescription = "Data yang anda cari belum tersedia di sistem."
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Memuat Data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold text-gray-900 mb-1">{emptyTitle}</p>
        <p className="text-sm text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
            {columns.map((col, idx) => (
              <th key={idx} className={cn("py-4 px-5", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item, rowIdx) => (
            <tr 
              key={rowIdx} 
              className={cn(
                "group hover:bg-gray-50/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={cn("py-4 px-5 text-gray-700", col.className)}>
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
