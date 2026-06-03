'use client';

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Funnel, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  HourglassHigh, 
  UserPlus,
  ArrowClockwise,
  Spinner
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Pendaftar {
  id: string;
  nama_lengkap: string;
  asal_kampus: string;
  status: string;
  created_at: string;
  prodi: { nama_prodi: string };
}

export default function AntreanAkademik() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [stats, setStats] = useState({ total: 0, baru: 0, proses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAntrean = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/akademik/antrean`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setPendaftar(res.data);
          setStats(res.stats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const filteredPendaftar = pendaftar.filter(p => 
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats_items = [
    { label: 'TOTAL DATA', value: stats.total, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'ANTREAN BARU', value: stats.baru, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'DALAM PROSES', value: stats.proses, icon: HourglassHigh, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'SELESAI ACC', value: stats.selesai, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registry Office</p>
            <h1 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">ANTREAN PENDAFTAR</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Monitoring status berkas konversi mahasiswa secara real-time.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchAntrean} className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 transition-colors shadow-sm">
                <ArrowClockwise size={20} weight="bold" className={loading ? "animate-spin" : ""} />
            </button>
            <Link 
                href="/akademik/scanner"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-950/20 transition hover:bg-black active:scale-95"
            >
                Input Berkas Baru
            </Link>
        </div>
      </header>

      {/* Stats Quick View */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats_items.map((item, i) => (
          <div key={i} className="akd-card p-5 flex items-center gap-4 group hover:border-blue-200 transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
              <item.icon size={24} weight="bold" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="akd-card overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
                <input 
                    type="text" 
                    placeholder="Cari Nama atau ID Pendaftar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                />
                <MagnifyingGlass size={18} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                <Funnel size={18} /> Filter Status
            </button>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2 px-4 pb-4">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="py-4 pl-4">ID Pendaftar</th>
                        <th className="py-4">Nama Lengkap</th>
                        <th className="py-4">Prodi Tujuan</th>
                        <th className="py-4">Asal Kampus</th>
                        <th className="py-4 text-center">Status</th>
                        <th className="py-4 pr-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="font-medium">
                    {loading ? (
                        <tr><td colSpan={6} className="py-20 text-center"><Spinner className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                    ) : filteredPendaftar.length === 0 ? (
                        <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Tidak ada data pendaftar</td></tr>
                    ) : (
                        filteredPendaftar.map((p) => (
                            <tr key={p.id} className="group transition-all duration-300 hover:translate-x-1">
                                <td className="py-4 pl-4 bg-white border-y border-l border-slate-100 rounded-l-2xl group-hover:bg-slate-50">
                                    <span className="font-mono text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">{p.id}</span>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50">
                                    <p className="font-black text-[#031f37] uppercase text-xs tracking-tight">{p.nama_lengkap}</p>
                                    <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">{new Date(p.created_at).toLocaleDateString('id-ID')}</p>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{p.prodi.nama_prodi}</p>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50">
                                    <p className="text-[10px] font-black text-[#094E8B] uppercase tracking-tighter">{p.asal_kampus}</p>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        p.status === 'Baru' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        p.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="py-4 pr-4 bg-white border-y border-r border-slate-100 rounded-r-2xl text-right group-hover:bg-slate-50">
                                    <Link 
                                        href={`/akademik/antrean/${p.id}`}
                                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#031f37] group-hover:text-[#FDD824] transition-all inline-block shadow-sm"
                                    >
                                        <ArrowRight size={18} weight="bold" />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
