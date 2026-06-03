'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  UserPlus, 
  UsersThree, 
  Spinner,
  X,
  ShieldCheck,
  Envelope,
  WhatsappLogo,
  FloppyDisk,
  UserCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
    id: number;
    nama_lengkap: string;
    email: string;
    no_whatsapp: string;
    role: string;
    status: string;
    total_prodi_dipegang: number;
}

export default function ManajemenUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    no_whatsapp: '',
    role: 'kaprodi',
    status: 'active',
    password: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/users`);
        const json = await res.json();
        if (json.success) {
            setUsers(json.data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
        setEditingUser(user);
        setForm({
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            no_whatsapp: user.no_whatsapp || '',
            role: user.role,
            status: user.status,
            password: ''
        });
    } else {
        setEditingUser(null);
        setForm({
            nama_lengkap: '',
            email: '',
            no_whatsapp: '',
            role: 'kaprodi',
            status: 'active',
            password: ''
        });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editingUser 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/users/${editingUser.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/users`;
    
    try {
        const res = await fetch(url, {
            method: editingUser ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const json = await res.json();
        if (json.success) {
            setModalOpen(false);
            fetchData();
            toast.success(editingUser ? 'Informasi user berhasil diperbarui' : 'User baru berhasil didaftarkan');
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
    if (!confirm(`Hapus user ${name}?`)) return;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/users/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
            fetchData();
            toast.success('User berhasil dihapus');
        }
    } catch (err) {
        toast.error('Gagal menghapus data.');
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
        'admin_pt': 'Admin Institusi',
        'staff': 'Staff Intake',
        'akademik': 'Akademik',
        'kaprodi': 'Kaprodi',
    };
    return labels[role] || role;
  };

  const getStatusBadge = (status: string) => {
    const active = status === 'active';
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
            active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
        )}>
            {status}
        </span>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Management</p>
            <h2 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">MANAJEMEN USER</h2>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">Kelola akses akun Staf Akademik, Staff Intake, dan Kaprodi.</p>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-black active:scale-95"
        >
          <UserPlus size={20} weight="bold" className="text-[#FDD824]" />
          Tambah User
        </button>
      </header>

      <div className="akd-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                            <th className="py-4 px-6 uppercase">Nama Lengkap</th>
                            <th className="py-4 px-4 uppercase">Email & Kontak</th>
                            <th className="py-4 px-4 uppercase text-center">Role</th>
                            <th className="py-4 px-4 uppercase text-center">Status</th>
                            <th className="py-4 px-4 uppercase text-center">Tugas</th>
                            <th className="py-4 px-6 text-right uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                                            {user.nama_lengkap.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="font-black text-[#031f37] uppercase text-xs tracking-tight">{user.nama_lengkap}</p>
                                    </div>
                                </td>
                                <td className="py-5 px-4">
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1.5 text-slate-600 font-bold"><Envelope size={14} className="text-slate-300" /> {user.email}</p>
                                        <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold"><WhatsappLogo size={14} className="text-emerald-500" /> {user.no_whatsapp || '-'}</p>
                                    </div>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg font-black text-[10px] uppercase border border-blue-100">{getRoleLabel(user.role)}</span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="py-5 px-4 text-center">
                                    {user.role === 'kaprodi' ? (
                                        <span className="text-[10px] font-black text-[#031f37] bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">{user.total_prodi_dipegang} PRODI</span>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <PencilSimple size={18} weight="bold" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id, user.nama_lengkap)}
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
            <div className="absolute inset-0 bg-[#031f37]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalOpen(false)}></div>
            <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="bg-[#031f37] p-8 text-white flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">User Identity</p>
                        <h3 className="font-heading text-xl font-black mt-1 uppercase tracking-tight">{editingUser ? 'Update Informasi User' : 'Daftarkan User Baru'}</h3>
                    </div>
                    <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Nama Lengkap</label>
                        <input 
                            type="text" required 
                            value={form.nama_lengkap}
                            onChange={(e) => setForm({...form, nama_lengkap: e.target.value})}
                            placeholder="Contoh: John Doe, M.Kom"
                            className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Login</label>
                            <input 
                                type="email" required 
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                placeholder="johndoe@kampus.ac.id"
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">No. WhatsApp</label>
                            <input 
                                type="text" 
                                value={form.no_whatsapp}
                                onChange={(e) => setForm({...form, no_whatsapp: e.target.value})}
                                placeholder="0812xxxxxxxx"
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Role Jabatan</label>
                            <select 
                                value={form.role} 
                                onChange={(e) => setForm({...form, role: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            >
                                <option value="kaprodi">Ketua Program Studi (Kaprodi)</option>
                                <option value="akademik">Staf Akademik / Verifikator</option>
                                <option value="staff">Staff Intake / Admin Pendaftaran</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Status Akun</label>
                            <select 
                                value={form.status} 
                                onChange={(e) => setForm({...form, status: e.target.value})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">{editingUser ? 'Password Baru (Kosongkan jika tetap)' : 'Password Awal'}</label>
                        <input 
                            type="password" required={!editingUser}
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all" 
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-10 py-4 bg-[#031f37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                        >
                            {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-[#FDD824]" /> {editingUser ? 'Simpan Perubahan' : 'Daftarkan User'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
