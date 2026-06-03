'use client';

import React, { useState, useEffect } from 'react';
import { 
  Gear, 
  FloppyDisk, 
  Spinner, 
  ShieldCheck, 
  Robot, 
  Globe, 
  Envelope, 
  Layout,
  HardDrives,
  CurrencyCircleDollar
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PengaturanGlobal() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/config`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setConfig(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        const json = await res.json();
        if (json.success) {
            toast.success('Konfigurasi global berhasil disimpan.');
        } else {
            toast.error('Gagal menyimpan konfigurasi.');
        }
    } catch (err) {
        toast.error('Terjadi kesalahan jaringan.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-l-4 border-yellow-400 pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Environment Config</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">PENGATURAN GLOBAL</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Konfigurasi parameter sistem, integrasi pihak ketiga, dan tarif standar platform.</p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
            <div className="akd-card p-8 space-y-6">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-4 flex items-center gap-2">
                    <Globe size={20} weight="bold" className="text-blue-600" /> Identitas Platform
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Aplikasi</label>
                        <input 
                            type="text" value={config.app_name || ''}
                            onChange={(e) => setConfig({...config, app_name: e.target.value})}
                            className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Versi Sistem</label>
                        <input 
                            type="text" value={config.app_version || ''}
                            onChange={(e) => setConfig({...config, app_version: e.target.value})}
                            className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                        />
                    </div>
                </div>
            </div>

            <div className="akd-card p-8 space-y-6">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-4 flex items-center gap-2">
                    <CurrencyCircleDollar size={20} weight="bold" className="text-emerald-600" /> Tarif Standar Platform
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Tarif Internal (Per Mhs)</label>
                        <div className="relative mt-1.5">
                            <input 
                                type="number" value={config.default_tarif_internal || ''}
                                onChange={(e) => setConfig({...config, default_tarif_internal: e.target.value})}
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none pl-12" 
                            />
                            <span className="absolute left-4 top-4 text-slate-400 font-bold text-xs uppercase">Rp</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Tarif Lead Marketplace (Per Lead)</label>
                        <div className="relative mt-1.5">
                            <input 
                                type="number" value={config.default_tarif_lead || ''}
                                onChange={(e) => setConfig({...config, default_tarif_lead: e.target.value})}
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none pl-12" 
                            />
                            <span className="absolute left-4 top-4 text-slate-400 font-bold text-xs uppercase">Rp</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="akd-card p-8 space-y-6">
                <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-4 flex items-center gap-2">
                    <HardDrives size={20} weight="bold" className="text-orange-600" /> Integrasi Pihak Ketiga
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Sumopod Master API Key</label>
                        <input 
                            type="password" value={config.sumopod_master_key || ''}
                            onChange={(e) => setConfig({...config, sumopod_master_key: e.target.value})}
                            className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp Gateway Token</label>
                            <input 
                                type="password" value={config.wa_gateway_token || ''}
                                onChange={(e) => setConfig({...config, wa_gateway_token: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">SMTP Host</label>
                            <input 
                                type="text" value={config.smtp_host || ''}
                                onChange={(e) => setConfig({...config, smtp_host: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={saving}
                    className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                >
                    {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-yellow-400" /> Simpan Konfigurasi Global</>}
                </button>
            </div>
        </div>

        <div className="space-y-6">
            <div className="akd-card p-8 bg-black text-white border-none shadow-2xl relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-10"></div>
                <ShieldCheck size={32} weight="fill" className="text-yellow-400 mb-4" />
                <h4 className="font-black text-lg uppercase tracking-tight">Security Protocol</h4>
                <p className="text-sm font-medium text-white/60 mt-2 leading-relaxed">Seluruh kunci API dan kredensial sensitif dienkripsi menggunakan standar AES-256 sebelum disimpan ke basis data.</p>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Encryption Active
                </div>
            </div>

            <div className="akd-card p-6">
                <h4 className="text-xs font-black uppercase text-slate-900 mb-4 flex items-center gap-2">
                    <Layout size={18} weight="bold" className="text-blue-600" /> UI Customization
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Accent Color (Hex)</label>
                        <div className="flex gap-2 mt-1.5">
                            <div className="w-10 h-10 rounded-xl border border-slate-200" style={{ backgroundColor: config.theme_accent_color || '#FDD824' }}></div>
                            <input 
                                type="text" value={config.theme_accent_color || '#FDD824'}
                                onChange={(e) => setConfig({...config, theme_accent_color: e.target.value})}
                                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono outline-none" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}
