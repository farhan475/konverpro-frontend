'use client';

import React from 'react';
import { 
  UsersThree, 
  MagnifyingGlass, 
  HourglassHigh, 
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react';
import Link from 'next/link';

export default function AkademikDashboard() {
  const stats = [
    { label: 'Total Aplikasi', value: 0, icon: UsersThree, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
    { label: 'Antrean Review', value: 0, icon: MagnifyingGlass, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' },
    { label: 'Menunggu Kaprodi', value: 0, icon: HourglassHigh, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-500' },
    { label: 'Konversi Selesai', value: 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`akd-card p-4 border-l-4 ${stat.border} hover:-translate-y-0.5 hover:shadow-xl transition-all`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} weight="bold" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="akd-card p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="border-l-4 border-[#FDD824] pl-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manual Origin Verification</p>
            <h3 className="font-heading text-lg font-black text-[#031f37] mt-1">SISTEM VERIFIKASI TRANSKRIP</h3>
            <p className="mt-1 text-xs text-slate-400">Gunakan workspace khusus untuk validasi mata kuliah satu per satu sebelum dikirim ke Kaprodi.</p>
          </div>
          <Link href="/akademik/scanner" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#031f37] px-5 py-3 text-xs font-black uppercase text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition">
            Buka Verifikasi <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
