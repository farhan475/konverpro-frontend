'use client';

import React, { useState, useEffect } from 'react';
import { 
  UsersThree, 
  ListChecks, 
  HourglassHigh, 
  CheckCircle,
  ArrowRight,
  ChartLineUp,
  Buildings,
  Stack,
  Clock,
  Sparkle
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Stats {
  total_pendaftar: number;
  pending_validasi: number;
  approved: number;
  total_prodi: number;
  avg_sks_diakui: number;
}

interface Pendaftar {
  id: string;
  nama_lengkap: string;
  status: string;
  created_at: string;
  prodi: { nama_prodi: string };
  total_mk_asal?: number;
}

export default function KaprodiDashboard() {
  const [data, setData] = useState<{
    stats: Stats;
    recent_pendaftar: Pendaftar[];
    academic_verified_queue: Pendaftar[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/dashboard`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  const stats = [
    { label: 'Total Konversi', value: data?.stats.total_pendaftar || 0, icon: UsersThree, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
    { label: 'Prodi Aktif', value: data?.stats.total_prodi || 0, icon: Buildings, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500' },
    { label: 'Menunggu Acc', value: data?.stats.pending_validasi || 0, icon: HourglassHigh, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500', pulse: (data?.stats.pending_validasi || 0) > 0 },
    { label: 'Avg SKS Diakui', value: data?.stats.avg_sks_diakui.toFixed(1) || '0.0', icon: ChartLineUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={
            `akd-card p-5 border-l-4 ${stat.border} hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group`
          }>
            {stat.pulse && <span className="absolute left-0 top-0 h-full w-1 bg-amber-500 animate-pulse"></span>}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider group-hover:text-slate-500 transition-colors">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} weight="bold" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue */}
        <section className="lg:col-span-2 space-y-6">
            <div className="akd-card p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Clock size={22} weight="bold" />
                        </div>
                        <div>
                            <h3 className="font-heading text-lg font-black text-[#031f37] uppercase">Antrean Validasi</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menunggu Keputusan Anda</p>
                        </div>
                    </div>
                    <Link href="/kaprodi/validasi" className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                        Lihat Semua <CaretRight weight="bold" />
                    </Link>
                </div>

                <div className="space-y-3">
                    {data?.academic_verified_queue.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                            <ListChecks size={40} weight="thin" className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tidak ada antrean pending</p>
                        </div>
                    ) : (
                        data?.academic_verified_queue.map((mhs) => (
                            <div key={mhs.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-[#031f37] font-black">
                                        <span className="text-[10px] leading-none opacity-40 uppercase">MK</span>
                                        <span className="text-lg leading-none">{mhs.total_mk_asal || 0}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#031f37] uppercase">{mhs.nama_lengkap}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{mhs.prodi.nama_prodi}</p>
                                    </div>
                                </div>
                                <Link 
                                    href={`/kaprodi/validasi/${mhs.id}`}
                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#031f37] group-hover:text-[#FDD824] transition-all"
                                >
                                    <ArrowRight size={20} weight="bold" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>

        {/* Recent Activity / Quick Actions */}
        <section className="space-y-6">
            <div className="akd-card p-6 bg-gradient-to-br from-[#031f37] to-[#094E8B] text-white border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
                <h3 className="font-heading text-lg font-black uppercase tracking-tight relative z-10">Tugas Hari Ini</h3>
                <p className="text-white/60 text-xs mt-1 relative z-10 font-medium">Selesaikan validasi tertunda untuk mempercepat proses pendaftaran.</p>
                
                <div className="mt-8 space-y-4 relative z-10">
                    <div className="flex items-center gap-3 p-3.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-blue-900">
                            <Sparkle size={18} weight="fill" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-wider">{data?.stats.pending_validasi} Berkas Menunggu</p>
                    </div>
                    <Link href="/kaprodi/validasi" className="block w-full py-4 bg-white text-[#031f37] rounded-2xl text-center text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-yellow-400 transition-colors">
                        Mulai Validasi
                    </Link>
                </div>
            </div>

            <div className="akd-card p-6">
                <h3 className="font-heading text-sm font-black text-[#031f37] uppercase mb-5">Aktivitas Terakhir</h3>
                <div className="space-y-4">
                    {data?.recent_pendaftar.map((item, idx) => (
                        <div key={idx} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className={cn(
                                \"w-2 h-2 rounded-full mt-1.5 shrink-0\",
                                item.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500'
                            )}></div>
                            <div>
                                <p className=\"text-xs font-black text-slate-700 uppercase\">{item.nama_lengkap}</p>
                                <p className=\"text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight\">{item.status} • {new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
