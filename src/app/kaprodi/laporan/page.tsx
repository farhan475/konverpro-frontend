'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBar, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowClockwise,
  ArrowRight,
  FilePdf,
  Export
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { ApiResponse, Pendaftar } from '@/lib/types';
import { toast } from 'sonner';

export default function LaporanKaprodiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>('/api/kaprodi/laporan');
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Laporan...</div>;

  const statsList = [
    { label: "Total Permohonan", value: data?.total_pendaftar || 0, icon: Users, color: "text-blue-900", bg: "bg-blue-50" },
    { label: "Telah Disetujui", value: data?.summary?.find((s: any) => s.status === 'Approved')?.total || 0, icon: CheckCircle, color: "text-green", bg: "bg-green-50" },
    { label: "SKS Diakui", value: data?.total_sks || 0, icon: FilePdf, color: "text-red", bg: "bg-red-50" },
    { label: "Perlu Validasi", value: data?.summary?.find((s: any) => s.status === 'Pending Kaprodi')?.total || 0, icon: Clock, color: "text-orange", bg: "bg-orange-50" },
  ];

  return (
    <div>
      <PageHeader 
        title="Laporan Akademik" 
        description="Rekapitulasi data konversi SKS dan statistik kelulusan mahasiswa pada program studi Anda."
      >
        <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Export size={18} weight="bold" /> Export CSV
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsList.map((stat, i) => (
          <Card key={i} className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={28} weight="bold" className={stat.color} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Breakdown Status */}
        <Card className="h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ChartBar size={24} weight="bold" className="text-blue-900" />
            Distribusi Status
          </h3>
          <div className="space-y-4">
            {data?.summary?.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-gray-600 uppercase">{s.status}</span>
                <Badge variant="neutral">{s.total}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Approved */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mahasiswa Terakhir Disetujui</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 px-2">Mahasiswa</th>
                    <th className="pb-4 px-2 text-center">SKS Diakui</th>
                    <th className="pb-4 px-2 text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.recent_approved?.length === 0 ? (
                    <tr><td colSpan={3} className="py-12 text-center text-gray-400 italic">Belum ada data disetujui.</td></tr>
                  ) : (
                    data?.recent_approved?.map((p: Pendaftar) => (
                      <tr key={p.id}>
                        <td className="py-4 px-2">
                          <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
                          <p className="text-[10px] text-gray-400 font-medium">NIM: {p.nim_asal || '-'}</p>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="font-bold text-blue-900">{p.total_sks_diakui} SKS</span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            {new Date(p.created_at || '').toLocaleDateString('id-ID')}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
