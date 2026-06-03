'use client';

import React, { useState, useEffect } from 'react';
import { 
  Buildings, 
  UsersThree, 
  CreditCard, 
  ChartLineUp, 
  ArrowRight,
  ShieldCheck,
  TrendUp,
  Stack,
  Clock,
  Money,
  CheckCircle,
  Spinner,
  ArrowUpRight,
  ShieldChevron,
  ChartPieSlice
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface Stats {
  total_kampus: number;
  total_mahasiswa_approved: number;
  pending_topup: number;
  total_pendaftar_global: number;
  total_revenue: number;
  total_prodi: number;
}

interface Activity {
    id: number;
    action: string;
    details: string;
    created_at: string;
    user: { nama_lengkap: string } | null;
    kampus: { nama_kampus: string } | null;
}

interface Kampus {
    id: number;
    nama_kampus: string;
    paket_layanan: string;
    pendaftar_count: number;
    status_akun: string;
}

interface ChartData {
    month: string;
    total: number;
}

export default function SuperadminDashboard() {
  const [data, setData] = useState<{
    stats: Stats;
    recent_activities: Activity[];
    kampus_terbaru: Kampus[];
    top_mitra: Kampus[];
    charts: {
        revenue: ChartData[];
        registration: ChartData[];
    }
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/dashboard`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;
  if (!data) return null;

  const cards = [
    { label: 'Total Revenue', value: `Rp ${(data.stats.total_revenue / 1000000).toFixed(1)}M`, icon: Money, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Mitra', value: data.stats.total_kampus, icon: Buildings, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Topup', value: data.stats.pending_topup, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', pulse: data.stats.pending_topup > 0 },
    { label: 'Global Approved', value: data.stats.total_mahasiswa_approved, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                <ShieldChevron size={14} weight="fill" className="text-yellow-400" /> Network Infrastructure
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">KONTROL PUSAT</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">Monitoring performa platform KonverPro secara global.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Traffic</p>
                <p className="text-sm font-black text-slate-900 mt-1 uppercase">100% Stable</p>
            </div>
        </div>
      </header>

      {/* Grid Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="akd-card p-6 flex items-center justify-between group hover:border-black transition-all">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{card.label}</p>
              <p className={cn("text-2xl font-black mt-1", card.color)}>{card.value}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center relative", card.bg, card.color)}>
              <card.icon size={24} weight="bold" />
              {card.pulse && <span className="absolute top-0 right-0 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>}
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="akd-card p-6">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <ChartLineUp size={20} weight="bold" className="text-emerald-600" /> Tren Pendapatan (Monthly)
                </h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.revenue}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="akd-card p-6">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <UsersThree size={20} weight="bold" className="text-blue-600" /> Pertumbuhan Pendaftar
                </h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.registration}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                            {data.charts.registration.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.charts.registration.length - 1 ? '#031f37' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Partners Table */}
        <section className="xl:col-span-2">
            <div className="akd-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <TrendUp size={20} weight="bold" className="text-blue-600" /> Mitra Teraktif
                    </h3>
                    <Link href="/superadmin/mitra" className="text-[10px] font-black uppercase text-blue-600 hover:underline">Kelola Mitra</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                <th className="py-4 px-6">Mitra Kampus</th>
                                <th className="py-4 px-4 text-center">Layanan</th>
                                <th className="py-4 px-4 text-center">Total Pendaftar</th>
                                <th className="py-4 px-4 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                            {data.top_mitra.map((mitra) => (
                                <tr key={mitra.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 px-6">
                                        <p className="font-black text-slate-900 uppercase tracking-tight">{mitra.nama_kampus}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter italic">MITRA #{mitra.id.toString().padStart(4, '0')}</p>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                            mitra.paket_layanan === 'Enterprise' ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                                        )}>{mitra.paket_layanan}</span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className="font-black text-slate-900">{mitra.pendaftar_count}</span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase",
                                            mitra.status_akun === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>{mitra.status_akun}</span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <Link href={`/superadmin/mitra?id=${mitra.id}`} className="text-slate-400 hover:text-black transition-colors">
                                            <ArrowUpRight size={18} weight="bold" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        {/* Audit Logs */}
        <section className="xl:col-span-1 space-y-6">
            <div className="akd-card p-6 h-full flex flex-col">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                    <Clock size={20} weight="bold" className="text-orange-600" /> Audit Logs Terakhir
                </h3>
                <div className="space-y-4 flex-1">
                    {data.recent_activities.map((log) => (
                        <div key={log.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0 flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                            <div>
                                <p className="text-[11px] font-black text-slate-800 uppercase leading-tight">{log.action}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">
                                    {log.user?.nama_lengkap || 'System'} @ {log.kampus?.nama_kampus || 'Core'}
                                </p>
                                <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">{new Date(log.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/superadmin/audit" className="mt-8 block w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                    Lihat Seluruh Log
                </Link>
            </div>
        </section>
      </div>
    </div>
  );
}
