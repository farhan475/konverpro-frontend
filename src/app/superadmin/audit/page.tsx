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
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<AuditLog[]>>(`/api/superadmin/audit?page=${page}`);
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
    fetchLogs();
  }, [page]);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.user?.nama_lengkap && log.user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              placeholder="Cari aksi atau nama user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Button variant="secondary" className="px-4 text-xs font-bold uppercase tracking-widest">
            <Funnel size={16} /> Filter Aksi
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4">Waktu & IP</th>
                <th className="py-4 px-4">User & Role</th>
                <th className="py-4 px-4">Aksi & Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={3} className="py-12 text-center text-gray-400 font-bold uppercase animate-pulse">Memuat Log...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={3} className="py-16 text-center text-gray-400 italic">Belum ada aktivitas tercatat.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-900">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <ShieldCheck size={12} weight="bold" className="text-blue-500" /> {log.ip_address || 'System'}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-700">{log.user?.nama_lengkap || 'SYSTEM'}</p>
                      <Badge variant="neutral" className="mt-1 text-[10px] uppercase">{log.user?.role || '-'}</Badge>
                    </td>
                    <td className="py-5 px-4">
                      <div className="max-w-md">
                        <p className="font-bold text-blue-900 uppercase text-xs">{log.action}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {log.details || '-'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
