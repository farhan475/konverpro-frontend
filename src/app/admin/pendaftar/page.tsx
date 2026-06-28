'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlass,
  UserPlus,
  Funnel,
  Eye
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getStatusVariant } from '@/lib/utils/status';
import api from '@/lib/api';
import { ApiResponse, PaginationMeta, Pendaftar } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ListPendaftarPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const fetchPendaftar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Pendaftar[]>>('/api/admin/pendaftar', {
        params: {
          page,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });
      if (data.success) {
        setPendaftar(data.data);
        setMeta(data.meta ?? null);
      }
    } catch {
      toast.error('Gagal mengambil data pendaftar');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(fetchPendaftar, 350);

    return () => window.clearTimeout(timeout);
  }, [fetchPendaftar]);

  return (
    <div>
      <PageHeader
        title="Data Pendaftar"
        description="Pantau seluruh data mahasiswa yang telah Anda input beserta status konversi terkini dari pihak Akademik dan Kaprodi."
      >
        <Link href="/admin/pendaftar/upload">
          <Button className="shadow-lg shadow-blue-900/20">
            <UserPlus size={20} weight="bold" /> Input Baru
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Cari nama atau NIM asal..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <Funnel size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              aria-label="Filter status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            >
              <option value="">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="AI Processing">AI Processing</option>
              <option value="Review Akademik">Review Akademik</option>
              <option value="Pending Kaprodi">Pending Kaprodi</option>
              <option value="Revisi">Revisi</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 px-4">Mahasiswa</th>
                <th className="pb-4 px-4">Asal Kampus / Prodi</th>
                <th className="pb-4 px-4">Prodi Tujuan</th>
                <th className="pb-4 px-4 text-center">Status</th>
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">Memuat data...</td></tr>
              ) : pendaftar.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 italic">Belum ada data pendaftar.</td></tr>
              ) : (
                pendaftar.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
                      <p className="text-[11px] text-gray-400 font-medium">NIM: {p.nim_asal || '-'}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-medium text-gray-600 truncate max-w-[200px]">{p.asal_kampus || '-'}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{p.asal_prodi || '-'}</p>
                    </td>
                    <td className="py-5 px-4">
                      <Badge variant="neutral" className="bg-gray-50">{p.prodi?.nama_prodi || '-'}</Badge>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <Badge variant={getStatusVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <Link href={`/admin/pendaftar/${p.id}`}>
                        <Button variant="ghost" className="w-9 h-9 p-0 rounded-full text-blue-900 hover:bg-blue-50">
                          <Eye size={18} weight="bold" />
                        </Button>
                      </Link>
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
              Menampilkan {pendaftar.length} dari {meta.total} data
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="px-4 py-2 text-xs"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="secondary"
                className="px-4 py-2 text-xs"
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
