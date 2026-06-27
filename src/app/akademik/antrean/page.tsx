'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlass,
  Funnel,
  ArrowRight,
  Clock,
  CheckCircle,
  HourglassHigh,
  ListBullets,
  ArrowClockwise,
  MagicWand,
  Eye
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { getStatusVariant } from '@/lib/utils/status';
import api from '@/lib/api';
import { ApiResponse, Pendaftar, StatusPendaftar } from '@/lib/types';
import { toast } from 'sonner';

export default function AntreanAkademikPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ baru: 0, ai: 0, review: 0, total: 0 });

  const fetchAntrean = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Pendaftar[]>>('/api/akademik/antrean');
      if (data.success) {
        setPendaftar(data.data);

        // Simple stats calculation
        const baru = data.data.filter(p => p.status === 'Baru').length;
        const ai = data.data.filter(p => p.status === 'AI Processing').length;
        const review = data.data.filter(p => p.status === 'Review Akademik').length;
        setStats({ baru, ai, review, total: data.data.length });
      }
    } catch (error) {
      toast.error('Gagal mengambil data antrean');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const filteredPendaftar = pendaftar.filter(p =>
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.nim_asal && p.nim_asal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Antrean Konversi"
        description="Monitoring dan kelola antrean permohonan konversi SKS. Lakukan review data parsing sebelum memicu proses matching AI."
      >
        <Button
          variant="secondary"
          onClick={fetchAntrean}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowClockwise size={20} weight="bold" className={loading ? 'animate-spin' : ''} /> Perbarui Data
        </Button>
      </PageHeader>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-900">
            <ListBullets size={28} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Antrean</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-orange-50 text-orange">
            <Clock size={28} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Perlu Review (Baru)</p>
            <p className="text-3xl font-bold text-gray-900">{stats.baru}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-700">
            <Eye size={28} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Perlu Konfirmasi</p>
            <p className="text-3xl font-bold text-gray-900">{stats.review}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Cari nama atau NIM asal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="px-4 text-xs font-bold uppercase tracking-widest">
              <Funnel size={16} /> Filter Prodi
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 px-4">Mahasiswa</th>
                <th className="pb-4 px-4">Prodi Tujuan</th>
                <th className="pb-4 px-4">Asal Kampus</th>
                <th className="pb-4 px-4 text-center">Status</th>
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">Memuat antrean...</td></tr>
              ) : filteredPendaftar.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 italic font-medium">Tidak ada permohonan dalam antrean.</td></tr>
              ) : (
                filteredPendaftar.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
                      <p className="text-[11px] text-gray-400 font-medium">NIM: {p.nim_asal || '-'}</p>
                    </td>
                    <td className="py-5 px-4">
                      <Badge variant="neutral" className="bg-gray-50">{p.prodi?.nama_prodi || '-'}</Badge>
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-medium text-gray-600 truncate max-w-[200px]">{p.asal_kampus || '-'}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{p.asal_prodi || '-'}</p>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <Badge variant={getStatusVariant(p.status)}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <Link href={`/akademik/antrean/${p.id}`}>
                        <Button variant="primary" className="px-5 py-2 text-xs">
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
