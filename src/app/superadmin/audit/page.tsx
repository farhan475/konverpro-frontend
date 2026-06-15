'use client';

import React, { useState, useEffect } from 'react';
import { 
  Note, 
  Clock, 
  MagnifyingGlass, 
  ShieldCheck,
  Funnel,
  Export
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  ip_address: string;
  created_at: string;
  user: { nama_lengkap: string; role: string } | null;
}

export default function AuditSystemPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<AuditLog[]>>(`/api/superadmin/audit`, {
        params: {
          page: page,
          search: searchTerm,
          action: actionFilter
        }
      });
      if (data.success) {
        setLogs(data.data);
        setMeta(data.meta);
      }
    } catch (error) {
      toast.error('Gagal mengambil data audit log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm, actionFilter]);

  const columns = [
    {
      header: 'Waktu & IP',
      accessor: (log: AuditLog) => (
        <div>
          <p className="font-bold text-gray-900">{new Date(log.created_at).toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <ShieldCheck size={12} weight="bold" className="text-blue-500" /> {log.ip_address || 'System'}
          </p>
        </div>
      )
    },
    {
      header: 'User & Role',
      accessor: (log: AuditLog) => (
        <div>
          <p className="font-bold text-gray-700">{log.user?.nama_lengkap || 'SYSTEM'}</p>
          <Badge variant="neutral" className="mt-1 text-[10px] uppercase">{log.user?.role || '-'}</Badge>
        </div>
      )
    },
    {
      header: 'Aksi & Detail',
      accessor: (log: AuditLog) => (
        <div className="max-w-md">
          <p className="font-bold text-blue-900 uppercase text-xs">{log.action}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {log.details || '-'}
          </p>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Audit Log Sistem" 
        description="Rekaman seluruh aktivitas penting yang dilakukan oleh pengguna di dalam sistem KonverPro UNSIA."
      >
        <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Export size={18} weight="bold" /> Export Log
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input 
              placeholder="Cari aksi, detail, atau nama user..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all font-bold text-gray-600 uppercase tracking-widest text-[10px]"
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Aksi</option>
              <option value="login">Login</option>
              <option value="create_prodi">Tambah Prodi</option>
              <option value="approve_konversi">Approve Konversi</option>
              <option value="config.updated">Update Config</option>
            </select>
          </div>
        </div>

        {logs.length === 0 && !loading ? (
          <EmptyState 
            title="Tidak Ada Log Ditemukan" 
            description="Belum ada aktivitas yang tercatat atau tidak ada data yang cocok dengan pencarian anda."
            icon={Clock}
          />
        ) : (
          <DataTable 
            columns={columns} 
            data={logs} 
            loading={loading}
          />
        )}

        {meta && meta.last_page > 1 && (
          <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Halaman {meta.current_page} dari {meta.last_page}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="px-4 py-2 text-xs font-bold" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </Button>
              <Button 
                variant="secondary" 
                className="px-4 py-2 text-xs font-bold" 
                disabled={page === meta.last_page}
                onClick={() => setPage(page + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
