'use client';

import React, { useState, useEffect } from 'react';
import { 
  UsersThree, 
  HourglassHigh, 
  CheckCircle, 
  ChartLineUp, 
  Buildings, 
  ArrowRight,
  CaretRight,
  Funnel,
  TrendUp,
  Stack,
  Pulse
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';

interface Stats {
  total_prodi: number;
  total_users: number;
  total_pendaftar: number;
  pending_validasi: number;
  approved: number;
  avg_sks_diakui: number;
  total_mk: number;
}

interface ProdiPerformance {
  id: number;
  nama_prodi: string;
  jenjang: string;
  total_pendaftar: number;
  pending_validasi: number;
  approved: number;
  avg_sks_diakui: number;
  kaprodi: { nama_lengkap: string } | null;
}

interface StatusBreakdown {
  status: string;
  total: number;
}

interface ChartData {
    month: string;
    total: number;
}

export default function AdminPtDashboard() {
  const [data, setData] = useState<{
    stats: Stats;
    prodi_performance: ProdiPerformance[];
    status_breakdown: StatusBreakdown[];
    registration_chart: ChartData[];
    kampus: { nama_kampus: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/dashboard`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!data) return null;

  const statCards = [
    { label: 'Total Konversi', value: data.stats.total_pendaftar, icon: UsersThree, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
    { label: 'Pending Validasi', value: data.stats.pending_validasi, icon: HourglassHigh, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500', pulse: data.stats.pending_validasi > 0 },
    { label: 'Prodi Aktif', value: data.stats.total_prodi, icon: Buildings, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500' },
    { label: 'Avg SKS Diakui', value: data.stats.avg_sks_diakui.toFixed(1), icon: ChartLineUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#031f37] to-[#094E8B] p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-[100px] opacity-10 -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-blue-950 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                    <TrendUp size={14} weight="bold" /> High Performance
                </div>
                <h1 className="font-heading text-3xl lg:text-5xl font-black tracking-tight leading-tight uppercase tracking-tighter">
                    Dashboard <span className="text-yellow-400">Institusi</span>
                </h1>
                <p className="mt-4 text-sm lg:text-lg text-blue-100 font-medium opacity-80 max-w-xl">
                    Pantau efisiensi konversi SKS, beban kerja Kaprodi, dan pertumbuhan pendaftar di {data.kampus.nama_kampus}.
                </p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-2">Total MK</p>
                    <p className="text-3xl font-black">{data.stats.total_mk}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-2">Users</p>
                    <p className="text-3xl font-black">{data.stats.total_users}</p>
                </div>
            </div>
        </div>
      </header>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 -mt-12 relative z-20 px-4 lg:px-0">
        {statCards.map((stat, i) => (
          <div key={i} className="akd-card p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={26} weight="bold" />
              </div>
              {stat.pulse && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
              <p className={cn("text-3xl font-black mt-1", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-1 space-y-6">
            <div className="akd-card p-6">
                <h3 className="font-heading text-lg font-black text-[#031f37] mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <Stack size={22} weight="bold" className="text-blue-600" /> Distribusi Status
                </h3>
                <div className="space-y-3">
                    {data.status_breakdown.map((row, i) => (
                        <div key={i} className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all">
                            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{row.status}</span>
                            <span className="px-3 py-1 bg-white text-[#031f37] rounded-xl shadow-sm font-black text-xs group-hover:bg-[#031f37] group-hover:text-white transition-colors">{row.total}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="akd-card p-6">
                <h3 className="font-heading text-sm font-black text-[#031f37] mb-6 uppercase tracking-tight flex items-center gap-2">
                    <ChartLineUp size={20} weight="bold" className="text-emerald-600" /> Tren Pendaftar
                </h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.registration_chart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" hide />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={20}>
                                {data.registration_chart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === data.registration_chart.length - 1 ? '#031f37' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>

        <section className="xl:col-span-2">
            <div className="akd-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Buildings size={22} weight="bold" />
                        </div>
                        <div>
                            <h3 className="font-heading text-lg font-black text-[#031f37] uppercase tracking-tight">Performa Tiap Prodi</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Monitoring beban kerja Kaprodi</p>
                        </div>
                    </div>
                    <Link href="/admin-pt/prodi" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors">
                        <Funnel size={20} weight="bold" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                                <th className="py-4 px-6">Program Studi</th>
                                <th className="py-4 px-4 text-center">Pendaftar</th>
                                <th className="py-4 px-4 text-center">Pending</th>
                                <th className="py-4 px-4 text-center">Approved</th>
                                <th className="py-4 px-4 text-center">Avg SKS</th>
                                <th className="py-4 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                            {data.prodi_performance.map((prodi) => (
                                <tr key={prodi.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 px-6">
                                        <p className="font-black text-[#031f37] uppercase">{prodi.jenjang} {prodi.nama_prodi}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
                                            <UsersThree size={14} /> {prodi.kaprodi?.nama_lengkap || 'Belum ditugaskan'}
                                        </p>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-black text-xs">{prodi.total_pendaftar}</span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="font-black text-amber-600">{prodi.pending_validasi}</span>
                                    </td>
                                    <td className="py-5 px-4 text-center text-emerald-700 font-black">
                                        {prodi.approved}
                                    </td>
                                    <td className="py-5 px-4 text-center font-black text-slate-600">
                                        {prodi.avg_sks_diakui.toFixed(1)}
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <Link href="/admin-pt/prodi" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#031f37] group-hover:text-yellow-400 transition-all inline-block">
                                            <ArrowRight size={18} weight="bold" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
