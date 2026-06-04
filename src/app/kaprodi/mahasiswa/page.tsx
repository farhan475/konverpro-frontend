'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  MagnifyingGlass,
  Funnel,
  DownloadSimple,
  IdentificationBadge
} from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface Mahasiswa {
  id: string;
  nama_lengkap: string;
  asal_kampus: string;
  status: string;
  jalur_masuk: string;
  total_sks_diakui: number;
  created_at: string;
  prodi?: {
    nama_prodi: string;
  };
}

export default function DaftarMahasiswaKaprodi() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/mahasiswa`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setMahasiswa(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusPill = (status: string) => {
    const s = status.toLowerCase();
    let color = 'bg-slate-50 text-slate-600 border-slate-100';
    if (s.includes('approved')) color = 'bg-green-50 text-green-700 border-green-100';
    if (s.includes('rejected') || s.includes('revisi')) color = 'bg-red-50 text-red-600 border-red-100';
    if (s.includes('pending') || s.includes('review')) color = 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse';
    
    return (
      <span className={cn("px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider", color)}>
        {status}
      </span>
    );
  };

  const filteredData = mahasiswa.filter(m => 
    m.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || 
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.asal_kampus?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <section className="akd-card p-5 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Mahasiswa</p>
            <h3 className="font-heading text-xl font-black text-[#031f37] mt-1 uppercase tracking-tight">DATA MAHASISWA PRODI</h3>
            <p className="mt-1.5 text-xs text-slate-400 font-medium">Pantau seluruh mahasiswa yang terdaftar di Program Studi Anda.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Cari Mahasiswa..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <MagnifyingGlass size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition shadow-sm">
                <DownloadSimple size={16} weight="bold" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Identitas Mahasiswa</th>
                <th className="px-6 py-4">Jalur Masuk</th>
                <th className="px-6 py-4 text-center">SKS Diakui</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat data mahasiswa...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                      <Inbox size={40} className="opacity-30" />
                    </div>
                    <p className="font-black text-[#031f37] text-lg tracking-tight mb-1">Tidak ada data mahasiswa.</p>
                    <p className="text-xs font-medium">Coba gunakan kata kunci pencarian yang lain.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-[#031f37] text-[#FDD824] flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                          {row.nama_lengkap.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#031f37] text-sm uppercase tracking-tight">{row.nama_lengkap}</p>
                          <p className="mt-1 text-[10px] font-mono text-slate-400 font-bold">ID: {row.id} • {row.asal_kampus}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                        row.jalur_masuk === 'leads' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-200"
                      )}>
                        {row.jalur_masuk === 'leads' ? 'Leads Marketplace' : 'Walk-In Internal'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <p className="font-black text-[#094E8B] text-lg leading-none">{row.total_sks_diakui}</p>
                      <p className="text-[9px] font-black text-slate-300 uppercase mt-1">SKS</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getStatusPill(row.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2 text-[10px] font-black uppercase text-slate-600 hover:bg-[#031f37] hover:text-white hover:border-[#031f37] transition-all shadow-sm">
                        Detail <ArrowRight size={14} weight="bold" />
                      </button>
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
