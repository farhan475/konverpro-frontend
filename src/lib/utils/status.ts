import type { StatusPendaftar } from '@/lib/types';

export function getStatusVariant(status: StatusPendaftar): 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'ai' {
  switch (status) {
    case 'Approved': return 'success';
    case 'Rejected': return 'danger';
    case 'Revisi': return 'warning';
    case 'AI Processing': return 'ai';
    case 'Pending Kaprodi': return 'info';
    case 'Review Akademik': return 'info';
    default: return 'neutral';
  }
}
