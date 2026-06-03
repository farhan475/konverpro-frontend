'use client';

import React, { useState, useEffect } from 'react';
import { 
  Buildings, 
  UserCircle, 
  Phone, 
  Globe, 
  MapPin, 
  FloppyDisk, 
  Spinner,
  ShieldCheck,
  SealCheck
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface KampusConfig {
    rektor_pimpinan: string;
    no_telp: string;
    website: string;
    alamat_resmi: string;
    paket_layanan: string;
    is_official_partner: boolean;
}

export default function PengaturanKampus() {
  const [config, setConfig] = useState<KampusConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/config`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setConfig(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        const json = await res.json();
        if (json.success) {
            toast.success('Profil kampus berhasil diperbarui');
        } else {
            toast.error(json.message || 'Gagal menyimpan profil');
        }
    } catch (err) {
        toast.error('Terjadi kesalahan jaringan.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;
  if (!config) return null;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-l-4 border-[#FDD824] pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institution Profile</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">PENGATURAN KAMPUS</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Kelola identitas resmi institusi Anda yang akan muncul pada dokumen output.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <form onSubmit={handleSave} className="xl:col-span-2 space-y-6">
            <div className="akd-card p-8 lg:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Pimpinan / Rektor</label>
                        <div className="relative mt-1.5">
                            <input 
                                type="text" value={config.rektor_pimpinan || ''}
                                onChange={(e) => setConfig({...config, rektor_pimpinan: e.target.value})}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pl-12" 
                            />
                            <UserCircle size={20} className="absolute left-4 top-4 text-slate-300" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nomor Telepon</label>
                        <div className="relative mt-1.5">
                            <input 
                                type="text" value={config.no_telp || ''}
                                onChange={(e) => setConfig({...config, no_telp: e.target.value})}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pl-12" 
                            />
                            <Phone size={20} className="absolute left-4 top-4 text-slate-300" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Website Resmi</label>
                    <div className="relative mt-1.5">
                        <input 
                            type="text" value={config.website || ''}
                            onChange={(e) => setConfig({...config, website: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pl-12" 
                        />
                        <Globe size={20} className="absolute left-4 top-4 text-slate-300" />
                    </div>
                </div>

                <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Alamat Resmi</label>
                    <div className="relative mt-1.5">
                        <textarea 
                            value={config.alamat_resmi || ''}
                            onChange={(e) => setConfig({...config, alamat_resmi: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pl-12 min-h-[120px]" 
                        />
                        <MapPin size={20} className="absolute left-4 top-4 text-slate-300" />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-10 py-4 bg-[#031f37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                    >
                        {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-[#FDD824]" /> Simpan Profil Kampus</>}
                    </button>
                </div>
            </div>
        </form>

        <div className="space-y-6">
            <div className="akd-card p-8 bg-[#031f37] text-white border-none shadow-2xl relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FDD824] rounded-full blur-3xl opacity-10"></div>
                <div className="flex items-center gap-2 mb-6">
                    <SealCheck size={24} weight="fill" className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Status Kemitraan</span>
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tight">{config.paket_layanan}</h4>
                <p className="text-sm font-medium text-blue-100/60 mt-2">Paket langganan aktif untuk institusi Anda.</p>
                
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-blue-200 uppercase">Official Partner</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                            config.is_official_partner ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        )}>{config.is_official_partner ? 'Verified' : 'Unverified'}</span>
                    </div>
                </div>
            </div>

            <div className="akd-card p-6 border-dashed border-2 border-slate-200 bg-slate-50/50">
                <h4 className="text-xs font-black uppercase text-[#031f37] mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} weight="bold" className="text-blue-600" /> Keamanan Sistem
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Perubahan data pada halaman ini akan berdampak pada seluruh kop surat, sertifikat konversi, dan dokumen digital yang diterbitkan sistem.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
