'use client';

import React, { useState, useEffect } from 'react';
import { 
  DownloadSimple, 
  ChartLineUp, 
  UsersThree, 
  CheckCircle, 
  HourglassHigh,
  ArrowRight,
  CaretRight,
  Funnel,
  Buildings,
  FileCsv
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Stats {
  total_pendaftar: number;
  pending_validasi: number;
  approved: number;
  avg_sks_diakui: number;
}

interface StatusBreakdown {
  status: string;
  total: number;
}

interface ProdiPerformance {
  id: number;
  nama_prodi: string;
  jenjang: string;
  kode_prodi: string;
  total_pendaftar: number;
  pending_validasi: number;
  approved: number;
  total_mk: number;
  total_sks_diakui: number;
}

interface ReportRow {
  id: string;
  nama_lengkap: string;
  email: string;
  asal_kampus: string;
  jalur_masuk: string;
  status: string;
  created_at: string;
  jumlah_mk_dikonversi: number;
  total_sks_diakui: number;
  prodi: {
    nama_prodi: string;
    jenjang: string;
  };
}

export default function LaporanKaprodi() {
  const [data, setData] = useState<{
    stats: Stats;
    status_breakdown: StatusBreakdown[];
    prodi_performance: ProdiPerformance[];
    report_rows: ReportRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/laporan`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const exportToCSV = () => {
    if (!data || data.report_rows.length === 0) return;

    const headers = ["ID", "Mahasiswa", "Email", "Asal Kampus", "Prodi Tujuan", "Jalur", "MK Dikonversi", "SKS Diakui", "Status", "Tanggal"];
    const rows = data.report_rows.map(row => [
      row.id,
      row.nama_lengkap,
      row.email || '-',
      row.asal_kampus || '-',
      `${row.prodi.jenjang} ${row.prodi.nama_prodi}`,
      row.jalur_masuk || '-',
      row.jumlah_mk_dikonversi,
      row.total_sks_diakui,
      row.status,
      new Date(row.created_at).toLocaleDateString('id-ID')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_KonverPro_Kaprodi_${new Date().getTime()}.csv`;
    link.click();
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'pending kaprodi') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (s === 'revisi' || s === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kaprodi Report Center</p>
            <h1 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">LAPORAN AKADEMIK</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">Rekapitulasi validasi SKS dan histori konversi mahasiswa.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-950/20 transition hover:bg-black active:scale-95"
        >
          <FileCsv size={20} weight="bold" className="text-[#FDD824]" />
          Export CSV
        </button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="akd-card p-5 border-l-4 border-blue-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pendaftar</p>
            <h3 className="mt-3 text-3xl font-black text-[#031f37]">{data.stats.total_pendaftar}</h3>
        </div>
        <div className="akd-card p-5 border-l-4 border-amber-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending</p>
            <h3 className="mt-3 text-3xl font-black text-amber-600">{data.stats.pending_validasi}</h3>
        </div>
        <div className="akd-card p-5 border-l-4 border-emerald-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Approved</p>
            <h3 className="mt-3 text-3xl font-black text-emerald-700">{data.stats.approved}</h3>
        </div>
        <div className="akd-card p-5 border-l-4 border-indigo-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rata-rata SKS</p>
            <h3 className="mt-3 text-3xl font-black text-indigo-700">{data.stats.avg_sks_diakui.toFixed(1)}</h3>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Prodi Performance Table */}
        <div className="akd-card p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Buildings size={22} weight="bold" />
                </div>
                <div>
                    <h2 className="font-heading text-lg font-black text-[#031f37]">Performa Program Studi</h2>
                    <p className="text-xs text-slate-400 font-medium">Ringkasan pendaftar dan kelulusan tiap prodi.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <th className="py-4 pr-4 uppercase">Program Studi</th>
                            <th className="px-4 py-4 text-center uppercase">Pendaftar</th>
                            <th className="px-4 py-4 text-center uppercase">Pending</th>
                            <th className="px-4 py-4 text-center uppercase">Approved</th>
                            <th className="py-4 pl-4 text-right uppercase">Total SKS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {data.prodi_performance.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 pr-4">
                                    <p className="font-black text-[#031f37]">{row.jenjang} - {row.nama_prodi}</p>
                                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tight">{row.kode_prodi || '-'}</p>
                                </td>
                                <td className="px-4 py-4 text-center font-black text-slate-700">{row.total_pendaftar}</td>
                                <td className="px-4 py-4 text-center font-black text-amber-600">{row.pending_validasi}</td>
                                <td className="px-4 py-4 text-center font-black text-emerald-700">{row.approved}</td>
                                <td className="py-4 pl-4 text-right font-black text-blue-800">{row.total_sks_diakui}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Status Breakdown */}
        <div className="akd-card p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <ChartLineUp size={22} weight="bold" />
                </div>
                <h2 className="font-heading text-lg font-black text-[#031f37]">Breakdown Status</h2>
            </div>
            <div className="space-y-3">
                {data.status_breakdown.map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{row.status}</span>
                        <span className="px-3 py-1 bg-white rounded-xl shadow-sm text-xs font-black text-[#031f37] group-hover:bg-[#031f37] group-hover:text-white transition-colors">{row.total}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* History Table */}
      <section className="akd-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <UsersThree size={22} weight="bold" />
                </div>
                <div>
                    <h2 className="font-heading text-lg font-black text-[#031f37]">Riwayat Konversi Mahasiswa</h2>
                    <p className="text-xs text-slate-400 font-medium tracking-tight uppercase tracking-[0.05em]">Basis data rekapitulasi akademik</p>
                </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-[#031f37]">{data.report_rows.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</span>
            </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full min-w-[1000px] text-left text-sm border-separate border-spacing-y-2">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="pb-4 pl-4 uppercase">ID Pendaftar</th>
                        <th className="pb-4 uppercase">Nama Mahasiswa</th>
                        <th className="pb-4 uppercase">Kampus Asal</th>
                        <th className="pb-4 text-center uppercase">MK</th>
                        <th className="pb-4 text-center uppercase">SKS</th>
                        <th className="pb-4 text-center uppercase">Status</th>
                        <th className="pb-4 pr-4 text-right uppercase">Tanggal</th>
                    </tr>
                </thead>
                <tbody className="font-medium">
                    {data.report_rows.length === 0 ? (
                        <tr><td colSpan={7} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Belum ada riwayat konversi</td></tr>
                    ) : (
                        data.report_rows.map((row) => (
                            <tr key={row.id} className="group hover:scale-[1.002] transition-all">
                                <td className="py-4 pl-4 bg-white border-y border-l border-slate-100 rounded-l-2xl group-hover:bg-slate-50">
                                    <span className="font-mono text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase">{row.id}</span>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50">
                                    <p className="font-black text-[#031f37] uppercase text-xs">{row.nama_lengkap}</p>
                                    <p className="text-[10px] text-slate-400 font-medium lowercase tracking-tight mt-0.5">{row.email || '-'}</p>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">{row.asal_kampus || '-'}</p>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50">
                                    <span className="font-black text-[#094E8B]">{row.jumlah_mk_dikonversi}</span>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50">
                                    <span className="font-black text-[#094E8B]">{row.total_sks_diakui}</span>
                                </td>
                                <td className="py-4 bg-white border-y border-slate-100 text-center group-hover:bg-slate-50">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider",
                                        getStatusBadgeClass(row.status)
                                    )}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="py-4 pr-4 bg-white border-y border-r border-slate-100 rounded-r-2xl text-right group-hover:bg-slate-50">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                        {new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}
