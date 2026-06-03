'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus,
  CloudArrowUp,
  MagnifyingGlass,
  Trash,
  PencilSimple,
  Books,
  Spinner,
  ArrowRight,
  Info
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  deskripsi_singkat: string;
}

export default function PemetaanKurikulumKaprodi() {
  const [mks, setMks] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/pemetaan`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setMks(res.data);
        }
        setLoading(false);
      });
  }, []);

  const filteredMks = mks.filter(mk => 
    mk.nama_mk.toLowerCase().includes(search.toLowerCase()) || 
    mk.kode_mk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <section className="akd-card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curriculum Management</p>
            <h3 className="font-heading text-xl lg:text-2xl font-black text-[#031f37] mt-1 uppercase tracking-tight">PEMETAAN KURIKULUM</h3>
            <p className="mt-1.5 text-xs text-slate-400 font-medium">Atur daftar mata kuliah prodi Anda sebagai acuan target konversi pendaftar.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Cari Mata Kuliah..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <MagnifyingGlass size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3 text-xs font-black uppercase text-white shadow-lg hover:bg-black transition">
                <Plus size={18} weight="bold" /> Tambah MK
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3 text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition shadow-sm">
                <CloudArrowUp size={18} weight="bold" /> Import
            </button>
          </div>
        </div>

        <div className="bg-blue-50/50 rounded-[1.5rem] p-4 border border-blue-100 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <Info size={24} weight="fill" />
            </div>
            <div>
                <p className="text-xs font-bold text-blue-900 leading-relaxed">
                    Mata kuliah yang Anda daftarkan di sini akan muncul di modul Akademik saat proses verifikasi transkrip dan menjadi target pemetaan konversi Kaprodi.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center font-black uppercase tracking-widest text-slate-400">Memuat Kurikulum...</div>
          ) : filteredMks.length === 0 ? (
            <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-200">
                    <Books size={48} className="text-slate-200" />
                </div>
                <p className="font-black text-[#031f37] text-xl tracking-tight">Belum ada mata kuliah.</p>
                <p className="text-sm text-slate-400 mt-2">Silakan tambah manual atau import dari file Excel.</p>
            </div>
          ) : (
            filteredMks.map((mk) => (
              <div key={mk.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group flex flex-col justify-between shadow-sm">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200">SEM {mk.semester}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition"><PencilSimple size={16} weight="bold" /></button>
                            <button className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg transition"><Trash size={16} weight="bold" /></button>
                        </div>
                    </div>
                    <h4 className="font-black text-[#031f37] text-base leading-tight uppercase tracking-tight mb-2 group-hover:text-blue-700 transition-colors">{mk.nama_mk}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{mk.kode_mk || 'TBA'} • {mk.sks} SKS</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 mb-6">{mk.deskripsi_singkat || 'Tidak ada deskripsi mata kuliah.'}</p>
                </div>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Reference</span>
                    <Link href={`/kaprodi/pemetaan/${mk.id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">Detail <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
