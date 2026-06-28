'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBar,
  Users,
  CheckCircle,
  Clock,
  FilePdf,
  Export,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { downloadBlob } from '@/lib/utils/download';
import { ApiResponse, KaprodiLaporan, Pendaftar, StatusSummary } from '@/lib/types';
import { toast } from 'sonner';

export default function LaporanKaprodiPage() {
  const [data, setData] = useState<KaprodiLaporan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<KaprodiLaporan>>('/api/kaprodi/laporan');
      if (data.success) {
        setData(data.data);
      }
    } catch {
      toast.error('Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Laporan...</div>;

  const columns = [
    {
      header: 'Mahasiswa',
      accessor: (p: Pendaftar) => (
        <div>
          <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
          <p className="text-[10px] text-gray-400 font-medium">NIM: {p.nim_asal || '-'}</p>
        </div>
      ),
    },
    {
      header: 'SKS Diakui',
      className: 'text-center',
      accessor: (p: Pendaftar) => (
        <span className="font-bold text-blue-900">{p.total_sks_diakui} SKS</span>
      ),
    },
    {
      header: 'Tanggal',
      className: 'text-right',
      accessor: (p: Pendaftar) => (
        <p className="text-[10px] font-bold text-gray-400 uppercase">
          {new Date(p.created_at || '').toLocaleDateString('id-ID')}
        </p>
      ),
    },
  ];

  const approvedTotal = data?.summary.find((s: StatusSummary) => s.status === 'Approved')?.total || 0;
  const pendingTotal = data?.summary.find((s: StatusSummary) => s.status === 'Pending Kaprodi')?.total || 0;

  return (
    <div>
      <PageHeader
        title="Laporan Akademik"
        description="Rekapitulasi data konversi SKS dan statistik kelulusan mahasiswa pada program studi Anda."
      >
        <Button
          variant="secondary"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={async () => {
            try {
              await downloadBlob('/api/kaprodi/laporan?format=csv', 'laporan_kaprodi_konverpro.csv');
            } catch {
              toast.error('Gagal mengekspor laporan');
            }
          }}
        >
          <Export size={18} weight="bold" /> Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Permohonan" value={data?.total_pendaftar || 0} icon={Users} variant="blue" />
        <StatCard label="Telah Disetujui" value={approvedTotal} icon={CheckCircle} variant="green" />
        <StatCard label="SKS Diakui" value={data?.total_sks || 0} icon={FilePdf} variant="red" />
        <StatCard label="Perlu Validasi" value={pendingTotal} icon={Clock} variant="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ChartBar size={24} weight="bold" className="text-blue-900" />
            Distribusi Status
          </h3>
          <div className="space-y-4">
            {data?.summary.map((s: StatusSummary) => (
              <div key={s.status} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-gray-600 uppercase">{s.status}</span>
                <Badge variant="neutral">{s.total}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mahasiswa Terakhir Disetujui</h3>
            <DataTable<Pendaftar>
              columns={columns}
              data={data?.recent_approved || []}
              loading={loading}
              emptyTitle="Belum Ada Data Disetujui"
              emptyDescription="Program studi Anda belum memiliki permohonan yang disetujui akhir-akhir ini."
            />
          </Card>
        </div>
      </div>
    </div>
  );
}