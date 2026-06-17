import React from 'react';
import { cn } from '@/lib/utils';

/* ─── Root ─── */
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table = ({ children, className, ...props }: TableProps) => (
  <div className="rounded-2xl border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table
        className={cn('w-full text-sm text-left', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  </div>
);

/* ─── Head ─── */
interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead = ({ children, className, ...props }: TableHeadProps) => (
  <thead className={cn('bg-gray-50 border-b border-gray-100', className)} {...props}>
    {children}
  </thead>
);

/* ─── Body ─── */
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = ({ children, className, ...props }: TableBodyProps) => (
  <tbody className={cn('divide-y divide-gray-50', className)} {...props}>
    {children}
  </tbody>
);

/* ─── Row ─── */
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow = ({ children, className, ...props }: TableRowProps) => (
  <tr
    className={cn('hover:bg-gray-50 transition-colors', className)}
    {...props}
  >
    {children}
  </tr>
);

/* ─── Header Cell ─── */
interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => (
  <th
    className={cn(
      'px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400',
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

/* ─── Data Cell ─── */
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const TableCell = ({ children, className, ...props }: TableCellProps) => (
  <td
    className={cn('px-4 py-3.5 text-sm text-gray-700', className)}
    {...props}
  >
    {children}
  </td>
);
