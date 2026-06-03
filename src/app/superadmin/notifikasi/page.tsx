'use client';

import React, { useState, useEffect } from 'react';
import { 
  Envelope, 
  WhatsappLogo, 
  PencilSimple, 
  FloppyDisk, 
  Spinner,
  X,
  Bell,
  Code,
  Info
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Template {
    id: number;
    kode_event: string;
    nama_event: string;
    subjek_email: string;
    konten_email: string;
    konten_wa: string;
    is_active: number;
}

export default function ManajemenNotifikasi() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    subjek_email: '',
    konten_email: '',
    konten_wa: '',
    is_active: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/notifikasi`);
        const json = await res.json();
        if (json.success) setTemplates(json.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenModal = (t: Template) => {
    setEditingTemplate(t);
    setForm({
        subjek_email: t.subjek_email || '',
        konten_email: t.konten_email || '',
        konten_wa: t.konten_wa || '',
        is_active: t.is_active
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    setSaving(true);
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/notifikasi/${editingTemplate.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                is_active: Boolean(form.is_active)
            })
        });
        const json = await res.json();
        if (json.success) {
            setModalOpen(false);
            fetchData();
        }
    } catch (err) {
        alert('Gagal menyimpan template.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-l-4 border-yellow-400 pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication Hub</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">TEMPLATE NOTIFIKASI</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Kelola pesan otomatis yang dikirimkan ke Mahasiswa dan Mitra melalui Email & WhatsApp.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((t) => (
            <div key={t.id} className="akd-card p-6 flex flex-col justify-between hover:border-black transition-all group">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-200">{t.kode_event}</span>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            t.is_active ? "bg-emerald-500" : "bg-slate-300"
                        )}></div>
                    </div>
                    <h4 className="font-black text-[#031f37] uppercase text-sm tracking-tight mb-2">{t.nama_event}</h4>
                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                        {t.subjek_email || t.konten_wa || 'Belum ada konten template.'}
                    </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Envelope size={18} className={cn(t.konten_email ? "text-blue-500" : "text-slate-200")} weight="bold" />
                        <WhatsappLogo size={18} className={cn(t.konten_wa ? "text-emerald-500" : "text-slate-200")} weight="bold" />
                    </div>
                    <button 
                        onClick={() => handleOpenModal(t)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-white transition-all"
                    >
                        <PencilSimple size={18} weight="bold" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* Modal Editor */}
      {modalOpen && editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalOpen(false)}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[90vh]">
                <div className="bg-black p-8 text-white flex items-center justify-between shrink-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">Template Editor</p>
                        <h3 className="font-heading text-xl font-black mt-1 uppercase tracking-tight">{editingTemplate.nama_event}</h3>
                    </div>
                    <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                        <Info size={24} weight="fill" className="text-blue-600 shrink-0" />
                        <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                            Gunakan placeholder seperti <code className="bg-white px-1 py-0.5 rounded text-blue-600 font-bold">{"{NAMA}"}</code>, <code className="bg-white px-1 py-0.5 rounded text-blue-600 font-bold">{"{KAMPUS}"}</code>, atau <code className="bg-white px-1 py-0.5 rounded text-blue-600 font-bold">{"{STATUS}"}</code> untuk personalisasi pesan.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Envelope size={18} weight="bold" className="text-blue-600" /> Channel Email
                        </h4>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Subjek Email</label>
                            <input 
                                type="text" 
                                value={form.subjek_email}
                                onChange={(e) => setForm({...form, subjek_email: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Konten HTML Email</label>
                            <textarea 
                                value={form.konten_email}
                                onChange={(e) => setForm({...form, konten_email: e.target.value})}
                                className="w-full mt-1.5 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-slate-700 outline-none min-h-[200px]" 
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <WhatsappLogo size={18} weight="bold" className="text-emerald-600" /> Channel WhatsApp
                        </h4>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Pesan Text WA</label>
                            <textarea 
                                value={form.konten_wa}
                                onChange={(e) => setForm({...form, konten_wa: e.target.value})}
                                placeholder="Gunakan *bold* dan _italic_ untuk formatting WA."
                                className="w-full mt-1.5 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none min-h-[150px]" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" id="is_active" 
                                checked={form.is_active === 1}
                                onChange={(e) => setForm({...form, is_active: e.target.checked ? 1 : 0})}
                                className="w-5 h-5 rounded-lg text-emerald-600"
                            />
                            <label htmlFor="is_active" className="text-xs font-black uppercase text-slate-700">Aktifkan Template</label>
                        </div>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                        >
                            {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-yellow-400" /> Simpan Template</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
