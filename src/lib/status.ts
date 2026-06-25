import type { StatusPendaftar } from '@/lib/types';

export type StatusBadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'ai';

export function getStatusBadgeVariant(status: StatusPendaftar): StatusBadgeVariant {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'danger';
    case 'Revisi':
      return 'warning';
    case 'AI Processing':
      return 'ai';
    case 'Pending Kaprodi':
    case 'Review Akademik':
      return 'info';
    default:
      return 'neutral';
  }
}
