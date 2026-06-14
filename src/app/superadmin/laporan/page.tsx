'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBar, 
  Users, 
  Buildings, 
  CheckCircle, 
  ArrowClockwise,
  MagicWand,
  ArrowRight,
  ShieldCheck
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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

  const COLORS = ['#031f37', '#094E8B', '#FDD824', '#16a34a', '#dc2626', '#ea580c', '#7c3aed'];

  return (
    <div>
      <PageHeader 
        title="Laporan & Statistik Global" 
        description="Analisis data konversi SKS di seluruh program studi Universitas Siber Asia."
      >
        <Button onClick={fetchLaporan} variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <ArrowClockwise size={18} weight="bold" className={loading ? 'animate-spin' : ''} /> Perbarui Data
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pendaftar per Prodi */}
        <Card className="h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Buildings size={24} weight="bold" className="text-blue-900" />
            Distribusi Mahasiswa per Prodi
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.pendaftar_per_prodi}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="nama_prodi" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10}}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="pendaftar_count" name="Total Pendaftar" fill="#031f37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribusi */}
        <Card className="h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle size={24} weight="bold" className="text-green" />
            Status Permohonan
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.status_distribusi}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="status"
                  label
                >
                  {data?.status_distribusi?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metode Matching */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MagicWand size={24} weight="bold" className="text-purple" />
            Performa Otomatisasi (Metode Matching)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="pb-4 px-2">Metode Pemetaan</th>
                  <th className="pb-4 px-2 text-center">Jumlah MK</th>
                  <th className="pb-4 px-2 text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.metode_matching?.map((item: any, i: number) => {
                  const total = data.metode_matching.reduce((acc: number, curr: any) => acc + curr.total, 0);
                  const percent = ((item.total / total) * 100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td className="py-4 px-2">
                        <Badge variant={item.metode_pemetaan === 'Fuzzy' ? 'info' : item.metode_pemetaan === 'Sumopod' ? 'ai' : 'warning'}>
                          {item.metode_pemetaan}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-center font-bold text-gray-900">{item.total}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-900 rounded-full" 
                              style={{width: `${percent}%`}}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-10">{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-blue-900 text-white border-none">
          <h3 className="text-lg font-bold mb-6">Ringkasan Sistem</h3>
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Total Prodi</p>
              <p className="text-3xl font-bold">{data?.pendaftar_per_prodi?.length || 0}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Total Pendaftar</p>
              <p className="text-3xl font-bold">
                {data?.status_distribusi?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 0}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Mata Kuliah Terpetakan</p>
              <p className="text-3xl font-bold">
                {data?.metode_matching?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
