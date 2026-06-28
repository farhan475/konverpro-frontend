'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlass,
  ArrowRight,
  CheckSquareOffset
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getStatusVariant } from '@/lib/utils/status';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { ApiResponse, Pendaftar } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ValidasiKaprodiPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkApproving, setIsBulkApproving] = useState(false);

  const fetchValidasi = async (search = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Pendaftar[]>>('/api/kaprodi/validasi', {
        params: {
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(status ? { status } : {}),
        },
      });
      if (data.success) {
        setPendaftar(data.data);
      }
    } catch {
      toast.error('Gagal mengambil data validasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchValidasi(searchTerm, statusFilter);
    }, 300);

    return () => window.clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const pendingItems = pendaftar.filter(p => p.status === 'Pending Kaprodi');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length > 0 && selectedIds.length === pendingItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingItems.map(p => p.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Apakah Anda yakin ingin menyetujui ${selectedIds.length} permohonan sekaligus?`)) return;

    setIsBulkApproving(true);
    try {
      const { data } = await api.post('/api/kaprodi/validasi/bulk-approve', { ids: selectedIds });
      if (data.success) {
        toast.success(data.message);
        setSelectedIds([]);
        fetchValidasi();
      } else {
        toast.error(data.message ?? 'Sebagian approval gagal diproses.');
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal melakukan persetujuan massal');
    } finally {
      setIsBulkApproving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Validasi Konversi SKS"
        description="Review dan berikan persetujuan akhir pada permohonan konversi mahasiswa. Anda dapat melakukan penyesuaian manual jika diperlukan."
      />

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Cari nama mahasiswa atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                isLoading={isBulkApproving}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest px-6"
              >
                <CheckSquareOffset size={18} weight="bold" /> Approve ({selectedIds.length})
              </Button>
            )}
            <select
              aria-label="Filter status validasi"
              className="min-h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-700/10"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setSelectedIds([]);
              }}
            >
              <option value="">Semua status</option>
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
                <th className="pb-4 px-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                    checked={selectedIds.length > 0 && selectedIds.length === pendingItems.length}
                    onChange={toggleSelectAll}
                    disabled={pendingItems.length === 0}
                  />
                </th>
                <th className="pb-4 px-4">Mahasiswa</th>
                <th className="pb-4 px-4">Asal Kampus / Prodi</th>
                <th className="pb-4 px-4 text-center">SKS Diakui</th>
                <th className="pb-4 px-4 text-center">Status</th>
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Antrean...</td></tr>
              ) : pendaftar.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400 italic font-medium">Belum ada permohonan yang perlu divalidasi.</td></tr>
              ) : (
                pendaftar.map((p) => (
                  <tr key={p.id} className={cn(
                    "group hover:bg-gray-50/50 transition-colors",
                    selectedIds.includes(p.id) && "bg-blue-50/50"
                  )}>
                    <td className="py-5 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                        disabled={p.status !== 'Pending Kaprodi'}
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
                      <p className="text-[11px] text-gray-400 font-medium">NIM: {p.nim_asal || '-'}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-medium text-gray-600 truncate max-w-[200px]">{p.asal_kampus || '-'}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{p.asal_prodi || '-'}</p>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="font-bold text-blue-900">{p.total_sks_diakui || 0} SKS</span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <Badge variant={getStatusVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <Link href={`/kaprodi/validasi/${p.id}`}>
                        <Button variant="primary" className="px-6 py-2 text-xs">
                          Review <ArrowRight size={14} weight="bold" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
