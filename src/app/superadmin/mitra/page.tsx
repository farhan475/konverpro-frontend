'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Buildings, 
  Envelope, 
  Phone, 
  IdentificationCard,
  Crown,
  Gear,
  Trash,
  PencilSimple,
  Spinner,
  X,
  FloppyDisk,
  UserCircle,
  ShieldCheck,
  TrendUp
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Mitra {
    id: number;
    nama_kampus: string;
    email_utama: string;
    no_telp: string;
    alamat_resmi: string;
    paket_layanan: string;
    status_akun: string;
    pendaftar_count: number;
    prodi_count: number;
    users_count: number;
}

export default function ManajemenMitra() {
  const [mitra, setMitra] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama_kampus: '',
    email_utama: '',
    no_telp: '',
    alamat_resmi: '',
    paket_layanan: 'Enterprise',
    status_akun: 'active',
    admin_nama: '',
    admin_email: '',
    admin_password: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/mitra`);
        const json = await res.json();
        if (json.success) setMitra(json.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenModal = (m: Mitra | null = null) => {
    if (m) {
        setEditingMitra(m);
        setForm({
            nama_kampus: m.nama_kampus,
            email_utama: m.email_utama,
            no_telp: m.no_telp || '',
            alamat_resmi: m.alamat_resmi || '',
            paket_layanan: m.paket_layanan,
            status_akun: m.status_akun,
            admin_nama: '',
            admin_email: '',
            admin_password: ''
        });
    } else {
        setEditingMitra(null);
        setForm({
            nama_kampus: '',
            email_utama: '',
            no_telp: '',
            alamat_resmi: '',
            paket_layanan: 'Enterprise',
            status_akun: 'active',
            admin_nama: '',
            admin_email: '',
            admin_password: ''
        });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editingMitra 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/mitra/${editingMitra.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/mitra`;
    
    try {
        const res = await fetch(url, {
            method: editingMitra ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const json = await res.json();
        if (json.success) {
            setModalOpen(false);
            fetchData();
            toast.success(editingMitra ? 'Data mitra berhasil diperbarui' : 'Mitra baru & Admin berhasil didaftarkan');
        } else {
            toast.error(json.message || 'Gagal menyimpan data.');
        }
    } catch (err) {
        toast.error('Gagal menghubungi server.');
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus mitra ${name} secara permanen? Seluruh data pendaftar dan prodi akan hilang.`)) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/mitra/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
            fetchData();
            toast.success('Mitra berhasil dihapus');
        }
    } catch (err) {
        toast.error('Gagal menghapus data.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="border-l-4 border-yellow-400 pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mitra Network</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">DAFTAR MITRA</h2>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">Monitoring dan manajemen akses institusi yang menggunakan layanan KonverPro.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-900 active:scale-95 transition-all"
        >
          <Plus size={20} weight="bold" className="text-yellow-400" />
          Daftarkan Mitra
        </button>
      </header>

      <div className="akd-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="py-4 px-6 uppercase">Institusi</th>
                        <th className="py-4 px-4 uppercase">Kontak Utama</th>
                        <th className="py-4 px-4 uppercase text-center">Layanan</th>
                        <th className="py-4 px-4 uppercase text-center">Metrik</th>
                        <th className="py-4 px-4 uppercase text-center">Status</th>
                        <th className="py-4 px-6 text-right uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                    {mitra.map((m) => (
                        <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-6">
                                <p className="font-black text-slate-900 uppercase tracking-tight">{m.nama_kampus}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter italic">MITRA #{m.id.toString().padStart(4, '0')}</p>
                            </td>
                            <td className="py-5 px-4">
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1.5 text-slate-600 font-bold text-xs"><Envelope size={14} className="text-slate-300" /> {m.email_utama}</p>
                                    <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold"><Phone size={14} className="text-slate-300" /> {m.no_telp || '-'}</p>
                                </div>
                            </td>
                            <td className="py-5 px-4 text-center">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                    m.paket_layanan === 'Enterprise' ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-blue-50 text-blue-700 border-blue-100"
                                )}>{m.paket_layanan}</span>
                            </td>
                            <td className="py-5 px-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-900 leading-none">{m.pendaftar_count}</p>
                                        <p className="text-[8px] text-slate-400 uppercase font-black mt-1">Mhs</p>
                                    </div>
                                    <div className="w-px h-6 bg-slate-100"></div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-900 leading-none">{m.prodi_count}</p>
                                        <p className="text-[8px] text-slate-400 uppercase font-black mt-1">Prodi</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5 px-4 text-center">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border",
                                    m.status_akun === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                )}>{m.status_akun}</span>
                            </td>
                            <td className="py-5 px-6 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(m)}
                                        className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition-all shadow-sm"
                                    >
                                        <PencilSimple size={18} weight="bold" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(m.id, m.nama_kampus)}
                                        className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash size={18} weight="bold" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="bg-black p-8 text-white flex items-center justify-between shrink-0">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">Mitra & Admin Registry</p>
                        <h3 className="font-heading text-xl font-black mt-1 uppercase tracking-tight">{editingMitra ? 'Update Informasi Mitra' : 'Daftarkan Institusi Baru'}</h3>
                    </div>
                    <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <Buildings size={18} weight="bold" className="text-blue-600" /> Profil Institusi
                        </h4>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Kampus / Sekolah Tinggi</label>
                            <input 
                                type="text" required 
                                value={form.nama_kampus}
                                onChange={(e) => setForm({...form, nama_kampus: e.target.value})}
                                placeholder="Universitas XYZ"
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Utama Institusi</label>
                                <input 
                                    type="email" required 
                                    value={form.email_utama}
                                    onChange={(e) => setForm({...form, email_utama: e.target.value})}
                                    placeholder="admin@kampus.ac.id"
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nomor Telepon</label>
                                <input 
                                    type="text" 
                                    value={form.no_telp}
                                    onChange={(e) => setForm({...form, no_telp: e.target.value})}
                                    placeholder="021-xxxx"
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Paket Layanan</label>
                                <select 
                                    value={form.paket_layanan} 
                                    onChange={(e) => setForm({...form, paket_layanan: e.target.value})}
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none"
                                >
                                    <option value="Enterprise">Enterprise (SaaS)</option>
                                    <option value="Premium">Premium (Dedicated)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Status Aktivasi</label>
                                <select 
                                    value={form.status_akun} 
                                    onChange={(e) => setForm({...form, status_akun: e.target.value})}
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="pending">Pending Review</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {!editingMitra && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
                            <h4 className="text-xs font-black uppercase text-slate-900 border-b border-yellow-100 pb-2 flex items-center gap-2">
                                <UserCircle size={18} weight="bold" className="text-yellow-600" /> Akun Admin Institusi
                            </h4>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Lengkap Admin</label>
                                <input 
                                    type="text" required 
                                    value={form.admin_nama}
                                    onChange={(e) => setForm({...form, admin_nama: e.target.value})}
                                    placeholder="Rektor / Staff Ahli"
                                    className="w-full mt-1.5 p-3.5 bg-white border border-yellow-100 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Login Admin</label>
                                    <input 
                                        type="email" required 
                                        value={form.admin_email}
                                        onChange={(e) => setForm({...form, admin_email: e.target.value})}
                                        className="w-full mt-1.5 p-3.5 bg-white border border-yellow-100 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Password Awal</label>
                                    <input 
                                        type="password" required 
                                        value={form.admin_password}
                                        onChange={(e) => setForm({...form, admin_password: e.target.value})}
                                        className="w-full mt-1.5 p-3.5 bg-white border border-yellow-100 rounded-2xl text-sm font-bold text-slate-900 outline-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-900 transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                        >
                            {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-yellow-400" /> {editingMitra ? 'Simpan Perubahan' : 'Finalisasi Pendaftaran'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
