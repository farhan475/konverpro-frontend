'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBar, 
  Users, 
  Files, 
  FilePdf, 
  Buildings,
  ArrowUpRight,
  TrendUp
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

export default function LaporanGlobalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>('/api/superadmin/laporan');
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data laporan global');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Laporan Global...</div>;

  const prodiColumns = [
    {
      header: 'Program Studi',
      accessor: (item: any) => (
        <p className="font-bold text-gray-900">{item.nama_prodi}</p>
      )
    },
    {
      header: 'Total Mahasiswa',
      className: 'text-center',
      accessor: 'total_mhs'
    },
    {
      header: 'Disetujui',
      className: 'text-center',
      accessor: 'approved'
    },
    {
      header: 'SKS Diakui',
      className: 'text-center',
      accessor: (item: any) => (
        <span className="font-bold text-blue-900">{item.total_sks || 0} SKS</span>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Laporan Global KonverPro" 
        description="Ringkasan eksekutif seluruh aktivitas konversi kredit di Universitas Siber Asia."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Pendaftar" 
          value={data?.global?.total_pendaftar || 0} 
          icon={Users} 
          variant="blue" 
        />
        <StatCard 
          label="Total SKS Diakui" 
          value={data?.global?.total_sks_diakui || 0} 
          icon={FilePdf} 
          variant="green" 
        />
        <StatCard 
          label="Rata-rata SKS / Mhs" 
          value={data?.global?.avg_sks_per_mhs || 0} 
          icon={TrendUp} 
          variant="purple" 
        />
        <StatCard 
          label="Total Prodi" 
          value={data?.by_prodi?.length || 0} 
          icon={Buildings} 
          variant="yellow" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ChartBar size={24} weight="bold" className="text-blue-900" />
              Performa Konversi Per Program Studi
            </h3>
            <DataTable 
              columns={prodiColumns} 
              data={data?.by_prodi || []} 
              loading={loading}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Status</h3>
            <div className="space-y-4">
              {data?.by_status?.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-bold text-gray-600 uppercase">{s.status}</span>
                  <Badge variant="neutral">{s.total}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-blue-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6">Tren Pendaftaran</h3>
            <div className="space-y-4">
              {data?.monthly_trends?.map((t: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-200">{t.month}</span>
                  <span className="text-sm font-bold text-white">{t.total} Mhs</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
