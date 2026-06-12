'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  MagnifyingGlass,
  UserCirclePlus,
  Funnel
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';
import { ApiResponse, User, Role } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    no_whatsapp: '',
    role: 'admin' as Role,
    password: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<User[]>>('/api/superadmin/users');
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        no_whatsapp: user.no_whatsapp || '',
        role: user.role,
        password: '', // Password empty when editing
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        nama_lengkap: '',
        email: '',
        no_whatsapp: '',
        role: 'admin',
        password: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingUser) {
        // Update
        const { data } = await api.put(`/api/superadmin/users/${editingUser.id}`, formData);
        if (data.success) {
          toast.success('Pengguna berhasil diperbarui');
          setIsModalOpen(false);
          fetchUsers();
        }
      } else {
        // Create
        const { data } = await api.post('/api/superadmin/users', formData);
        if (data.success) {
          toast.success('Pengguna baru berhasil ditambahkan');
          setIsModalOpen(false);
          fetchUsers();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data pengguna');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    try {
      const { data } = await api.delete(`/api/superadmin/users/${id}`);
      if (data.success) {
        toast.success('Pengguna berhasil dihapus');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Gagal menghapus pengguna');
    }
  };

  const filteredUsers = users.filter(user => 
    user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Manajemen Pengguna" 
        description="Kelola hak akses dan akun staf akademik, kaprodi, serta admin sistem KonverPro UNSIA."
      >
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-900/20">
          <UserCirclePlus size={20} weight="bold" /> Tambah User
        </Button>
      </PageHeader>

      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Input 
              placeholder="Cari nama atau email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="px-4 text-xs">
              <Funnel size={16} /> Filter Role
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 px-4">Nama & Email</th>
                <th className="pb-4 px-4 text-center">Role</th>
                <th className="pb-4 px-4 text-center">WhatsApp</th>
                <th className="pb-4 px-4 text-center">Status</th>
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Memuat data...</td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 italic">Tidak ada data pengguna ditemukan.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{user.nama_lengkap}</p>
                      <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={user.role === 'superadmin' ? 'danger' : user.role === 'admin' ? 'info' : 'neutral'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 font-medium">
                      {user.no_whatsapp || '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          className="w-9 h-9 p-0 rounded-full text-blue-700 hover:bg-blue-50"
                          onClick={() => handleOpenModal(user)}
                        >
                          <PencilSimple size={18} weight="bold" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-9 h-9 p-0 rounded-full text-red hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash size={18} weight="bold" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveUser} isLoading={isSaving}>Simpan Data</Button>
          </>
        )}
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input 
              label="Nama Lengkap" 
              placeholder="Masukkan nama lengkap..." 
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              required
            />
          </div>
          <Input 
            label="Email" 
            type="email" 
            placeholder="nama@unsia.ac.id" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            label="No. WhatsApp" 
            placeholder="62812xxxx" 
            value={formData.no_whatsapp}
            onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})}
          />
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Role</label>
            <select 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
            >
              <option value="admin">Admin</option>
              <option value="akademik">Akademik</option>
              <option value="kaprodi">Kaprodi</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Status</label>
            <select 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
            >
              <option value="active">Aktif</option>
              <option value="inactive">Non-aktif</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Input 
              label={editingUser ? "Ganti Password (Opsional)" : "Password"} 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required={!editingUser}
            />
            {editingUser && <p className="text-[10px] text-gray-400 mt-1 ml-1 font-medium italic">Kosongkan jika tidak ingin mengubah password.</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
}
