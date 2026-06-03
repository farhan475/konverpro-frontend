'use client';

import React, { useState, useEffect } from 'react';
import { Gear, UserCircle, Bell, ShieldCheck, Signature, SlidersHorizontal, FloppyDisk, Spinner, GraduationCap } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface UserData {
    nama_lengkap: string;
    email: string;
    role: string;
}

interface PengaturanProdi {
    id_prodi: number;
    min_akreditasi_asal: string;
    max_usia_ijazah_tahun: number;
    max_konversi_sks_persen: number;
    min_nilai_huruf: string;
    min_ipk: number;
    metode_pengakuan: string;
}

interface Prodi {
    id: number;
    nama_prodi: string;
    jenjang: string;
    pengaturan: PengaturanProdi | null;
}

export default function PengaturanKaprodi() {
  const [activeTab, setActiveTab] = useState<'profil' | 'akademik'>('profil');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [myProdi, setMyProdi] = useState<Prodi[]>([]);
  const [selectedProdiId, setSelectedProdiId] = useState<number | null>(null);
  const [prodiForm, setProdiForm] = useState<Partial<PengaturanProdi>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/pengaturan`);
        const json = await res.json();
        if (json.success) {
            setUserData(json.data.user);
            setMyProdi(json.data.my_prodi);
            if (json.data.my_prodi.length > 0) {
                const first = json.data.my_prodi[0];
                setSelectedProdiId(first.id);
                setProdiForm(first.pengaturan || {
                    min_akreditasi_asal: 'B',
                    max_usia_ijazah_tahun: 7,
                    max_konversi_sks_persen: 70,
                    min_nilai_huruf: 'C',
                    min_ipk: 2.5,
                    metode_pengakuan: 'direct'
                });
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleProdiChange = (id: number) => {
    const prodi = myProdi.find(p => p.id === id);
    if (prodi) {
        setSelectedProdiId(id);
        setProdiForm(prodi.pengaturan || {
            min_akreditasi_asal: 'B',
            max_usia_ijazah_tahun: 7,
            max_konversi_sks_persen: 70,
            min_nilai_huruf: 'C',
            min_ipk: 2.5,
            metode_pengakuan: 'direct'
        });
    }
  };

  const handleSaveProdi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdiId) return;
    
    setSaving(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/pengaturan/prodi/${selectedProdiId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prodiForm)
        });
        const json = await res.json();
        if (json.success) {
            alert('Pengaturan prodi berhasil disimpan');
            fetchData();
        }
    } catch (err) {
        alert('Gagal menyimpan pengaturan');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-6 pb-20">
      <section className="akd-card p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div className="border-l-4 border-[#FDD824] pl-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account & System</p>
                <h3 className="font-heading text-xl lg:text-2xl font-black text-[#031f37] mt-1 uppercase tracking-tight">PENGATURAN</h3>
                <p className="mt-1.5 text-sm text-slate-400 font-medium">Kelola profil, keamanan, dan aturan akademik prodi Anda.</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button 
                    onClick={() => setActiveTab('profil')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'profil' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Profil Saya
                </button>
                <button 
                    onClick={() => setActiveTab('akademik')}
                    className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'akademik' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Aturan Akademik
                </button>
            </div>
        </div>

        {activeTab === 'profil' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xs font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
                            <UserCircle size={20} weight="bold" className="text-blue-600" /> Profil Pengguna
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Lengkap</label>
                                <input type="text" value={userData?.nama_lengkap || ''} disabled className="w-full mt-1.5 p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Internal</label>
                                <input type="email" value={userData?.email || ''} disabled className="w-full mt-1.5 p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xs font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
                            <Signature size={20} weight="bold" className="text-blue-600" /> E-Signature Aktif
                        </h4>
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 flex items-center justify-center italic text-slate-300 text-xs">
                            Belum ada tanda tangan tersimpan di cloud.
                        </div>
                        <button className="w-full mt-4 py-3.5 bg-white border border-[#031f37] text-[#031f37] rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#031f37] hover:text-white transition shadow-sm">
                            Update Tanda Tangan
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                        <h4 className="text-xs font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
                            <ShieldCheck size={20} weight="bold" className="text-blue-600" /> Keamanan Akun
                        </h4>
                        <div className="space-y-4">
                            <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition shadow-sm flex items-center justify-between px-6">
                                Ganti Password <Gear size={16} />
                            </button>
                            <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition shadow-sm flex items-center justify-between px-6">
                                Two-Factor Auth (2FA) <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">OFF</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#031f37] p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#FDD824] rounded-full blur-3xl opacity-10"></div>
                        <h4 className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-4">Support Center</h4>
                        <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">Butuh bantuan dalam mengelola kurikulum? Baca panduan lengkap kami.</p>
                        <button className="px-6 py-3 bg-[#FDD824] text-[#031f37] rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-yellow-500/20 hover:scale-105 transition transform">Buka Dokumentasi</button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {myProdi.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <GraduationCap size={48} weight="thin" className="mx-auto text-slate-300 mb-4" />
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Belum Ditugaskan</h4>
                        <p className="text-sm text-slate-500 font-medium max-w-md mx-auto mt-2">Akun Anda belum dikaitkan dengan Program Studi manapun. Silakan hubungi Administrator Kampus.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-indigo-800 tracking-widest shrink-0 flex items-center gap-2">
                                <GraduationCap size={18} weight="bold" /> Pilih Program Studi:
                            </span>
                            <select 
                                value={selectedProdiId || ''} 
                                onChange={(e) => handleProdiChange(parseInt(e.target.value))}
                                className="w-full sm:w-auto flex-1 p-2.5 bg-white border border-indigo-200 rounded-xl font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm shadow-sm"
                            >
                                {myProdi.map(p => (
                                    <option key={p.id} value={p.id}>{p.jenjang} - {p.nama_prodi}</option>
                                ))}
                            </select>
                        </div>

                        <form onSubmit={handleSaveProdi} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                            <h3 className="text-xs font-black uppercase text-slate-900 mb-8 tracking-widest flex items-center gap-2 relative z-10">
                                <SlidersHorizontal size={20} weight="bold" className="text-indigo-600" /> Parameter Evaluasi Konversi
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Metode Pengakuan Nilai</label>
                                    <select 
                                        value={prodiForm.metode_pengakuan || 'direct'}
                                        onChange={(e) => setProdiForm({...prodiForm, metode_pengakuan: e.target.value})}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer text-sm"
                                    >
                                        <option value="direct">Direct (Pengakuan Langsung)</option>
                                        <option value="scale">Scale (Penyesuaian Skala)</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Nilai Huruf Minimal</label>
                                    <select 
                                        value={prodiForm.min_nilai_huruf || 'C'}
                                        onChange={(e) => setProdiForm({...prodiForm, min_nilai_huruf: e.target.value})}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer text-sm"
                                    >
                                        <option value="A">Minimal A</option>
                                        <option value="B">Minimal B</option>
                                        <option value="C">Minimal C (Standar)</option>
                                        <option value="D">Minimal D</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Maksimal SKS Diakui (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" min="1" max="100" 
                                            value={prodiForm.max_konversi_sks_persen || 70}
                                            onChange={(e) => setProdiForm({...prodiForm, max_konversi_sks_persen: parseInt(e.target.value)})}
                                            required 
                                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm" 
                                        />
                                        <span className="absolute right-5 top-4 font-black text-slate-300">%</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-2 ml-1 font-medium italic opacity-70">Maksimal % SKS yang boleh di-transfer.</p>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Batas Usia Transkrip</label>
                                    <div className="relative">
                                        <input 
                                            type="number" min="1" max="20" 
                                            value={prodiForm.max_usia_ijazah_tahun || 7}
                                            onChange={(e) => setProdiForm({...prodiForm, max_usia_ijazah_tahun: parseInt(e.target.value)})}
                                            required 
                                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm" 
                                        />
                                        <span className="absolute right-5 top-4 font-black text-slate-300">Tahun</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-2 ml-1 font-medium italic opacity-70">Batas kelulusan pendaftar dari kampus asal.</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Minimal Akreditasi Asal</label>
                                    <select 
                                        value={prodiForm.min_akreditasi_asal || 'B'}
                                        onChange={(e) => setProdiForm({...prodiForm, min_akreditasi_asal: e.target.value})}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer text-sm"
                                    >
                                        <option value="Unggul">Unggul / A</option>
                                        <option value="Baik Sekali">Baik Sekali / B</option>
                                        <option value="Baik">Baik / C</option>
                                        <option value="Tanpa Akreditasi">Tanpa Syarat</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Minimal IPK Pendaftar</label>
                                    <input 
                                        type="number" step="0.1" min="0" max="4" 
                                        value={prodiForm.min_ipk || 2.5}
                                        onChange={(e) => setProdiForm({...prodiForm, min_ipk: parseFloat(e.target.value)})}
                                        required 
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-10 relative z-10">
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="px-10 py-4 bg-[#031f37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-900/30 hover:bg-black transition transform active:scale-95 outline-none flex items-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-[#FDD824]" /> Simpan Aturan</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        )}
      </section>
    </div>
  );
}
