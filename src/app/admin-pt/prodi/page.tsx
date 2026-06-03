'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  UsersThree, 
  GraduationCap, 
  Stack, 
  Buildings,
  Spinner,
  X,
  IdentificationCard,
  Money,
  FloppyDisk
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface KaprodiOption {
    id: number;
    nama_lengkap: string;
}

interface Prodi {
    id: number;
    nama_prodi: string;
    jenjang: string;
    kode_prodi: string;
    id_kaprodi: number | null;
    biaya_pendaftaran: string;
    biaya_kuliah: string;
    kurikulum_count: number;
    kaprodi: KaprodiOption | null;
}

export default function ManajemenProdi() {
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [kaprodiOptions, setKaprodiOptions] = useState<KaprodiOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama_prodi: '',
    jenjang: 'S1',
    kode_prodi: '',
    id_kaprodi: '',
    biaya_pendaftaran: '0',
    biaya_kuliah: '0'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/prodi`);
        const json = await res.json();
        if (json.success) {
            setProdis(json.data);
            setKaprodiOptions(json.kaprodi_options);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenModal = (prodi: Prodi | null = null) => {
    if (prodi) {
        setEditingProdi(prodi);
        setForm({
            nama_prodi: prodi.nama_prodi,
            jenjang: prodi.jenjang,
            kode_prodi: prodi.kode_prodi || '',
            id_kaprodi: prodi.id_kaprodi ? String(prodi.id_kaprodi) : '',
            biaya_pendaftaran: prodi.biaya_pendaftaran,
            biaya_kuliah: prodi.biaya_kuliah
        });
    } else {
        setEditingProdi(null);
        setForm({
            nama_prodi: '',
            jenjang: 'S1',
            kode_prodi: '',
            id_kaprodi: '',
            biaya_pendaftaran: '0',
            biaya_kuliah: '0'
        });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editingProdi 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/prodi/${editingProdi.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/prodi`;
    
    try {
        const res = await fetch(url, {
            method: editingProdi ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                id_kaprodi: form.id_kaprodi === '' ? null : parseInt(form.id_kaprodi)
            })
        });
        const json = await res.json();
        if (json.success) {
            setModalOpen(false);
            fetchData();
            toast.success(editingProdi ? 'Data prodi berhasil diperbarui' : 'Program studi baru berhasil ditambahkan');
        }
    } catch (err) {
        toast.error('Gagal menyimpan data.');
    } finally {
        setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus program studi ${name}?`)) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/prodi/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
            fetchData();
            toast.success('Program studi berhasil dihapus');
        }
    } catch (err) {
        toast.error('Gagal menghapus data.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Registry</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">MANAJEMEN PRODI</h2>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">Kelola program studi dan penugasan Ketua Program Studi (Kaprodi).</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-black active:scale-95"
        >
          <Plus size={20} weight="bold" className="text-[#FDD824]" />
          Tambah Prodi
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="akd-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                            <th className="py-4 px-6">Program Studi</th>
                            <th className="py-4 px-4 uppercase">Kaprodi</th>
                            <th className="py-4 px-4 text-center uppercase">Kurikulum</th>
                            <th className="py-4 px-4 text-center uppercase">Biaya Daftar</th>
                            <th className="py-4 px-6 text-right uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {prodis.map((prodi) => (
                            <tr key={prodi.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 px-6">
                                    <p className="font-black text-[#031f37] uppercase">{prodi.jenjang} - {prodi.nama_prodi}</p>
                                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tight">{prodi.kode_prodi || '-'}</p>
                                </td>
                                <td className="py-5 px-4">
                                    <div className="flex items-center gap-2 text-[#031f37] font-bold">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <UsersThree size={16} />
                                        </div>
                                        <span>{prodi.kaprodi?.nama_lengkap || <span className="text-slate-300 font-medium italic">Belum ditugaskan</span>}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-black text-xs">{prodi.kurikulum_count} MK</span>
                                </td>
                                <td className="py-5 px-4 text-center text-slate-600 font-black">
                                    Rp {parseInt(prodi.biaya_pendaftaran).toLocaleString('id-ID')}
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(prodi)}
                                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <PencilSimple size={18} weight="bold" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(prodi.id, prodi.nama_prodi)}
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
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#031f37]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalOpen(false)}></div>
            <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="bg-[#031f37] p-8 text-white flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Form Management</p>
                        <h3 className="font-heading text-xl font-black mt-1 uppercase tracking-tight">{editingProdi ? 'Update Prodi' : 'Tambah Prodi Baru'}</h3>
                    </div>
                    <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Jenjang</label>
                            <select 
                                value={form.jenjang} 
                                onChange={(e) => setForm({...form, jenjang: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            >
                                <option value="D3">D3</option>
                                <option value="D4">D4</option>
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Program Studi</label>
                            <input 
                                type="text" required 
                                value={form.nama_prodi}
                                onChange={(e) => setForm({...form, nama_prodi: e.target.value})}
                                placeholder="Contoh: Informatika"
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Kode Prodi</label>
                            <input 
                                type="text" 
                                value={form.kode_prodi}
                                onChange={(e) => setForm({...form, kode_prodi: e.target.value})}
                                placeholder="Contoh: INF-001"
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Penugasan Kaprodi</label>
                            <select 
                                value={form.id_kaprodi}
                                onChange={(e) => setForm({...form, id_kaprodi: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            >
                                <option value="">Belum Ditugaskan</option>
                                {kaprodiOptions.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_lengkap}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Biaya Pendaftaran (Rp)</label>
                            <input 
                                type="number" 
                                value={form.biaya_pendaftaran}
                                onChange={(e) => setForm({...form, biaya_pendaftaran: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Biaya Kuliah / Semester (Rp)</label>
                            <input 
                                type="number" 
                                value={form.biaya_kuliah}
                                onChange={(e) => setForm({...form, biaya_kuliah: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-10 py-4 bg-[#031f37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                        >
                            {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-[#FDD824]" /> {editingProdi ? 'Simpan Perubahan' : 'Daftarkan Prodi'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
