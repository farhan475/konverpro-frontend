'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  MagnifyingGlass,
  Buildings,
  User
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';
import { ApiResponse, Prodi, User as UserType } from '@/lib/types';
import { toast } from 'sonner';

export default function ProdiManagementPage() {
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [kaprodis, setKaprodis] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
  const [formData, setFormData] = useState({
    nama_prodi: '',
    kode_prodi: '',
    jenjang: 'S1' as 'D3' | 'D4' | 'S1' | 'S2',
    id_kaprodi: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodiRes, userRes] = await Promise.all([
        api.get<ApiResponse<Prodi[]>>('/api/referensi/prodi'),
        api.get<ApiResponse<UserType[]>>('/api/superadmin/users') 
      ]);
      
      if (prodiRes.data.success) {
        setProdis(prodiRes.data.data);
      }
      
      if (userRes.data.success) {
        setKaprodis(userRes.data.data.filter(u => u.role === 'kaprodi'));
      }
    } catch (error) {
      toast.error('Gagal mengambil data program studi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (prodi: Prodi | null = null) => {
    if (prodi) {
      setEditingProdi(prodi);
      setFormData({
        nama_prodi: prodi.nama_prodi,
        kode_prodi: prodi.kode_prodi || '',
        jenjang: prodi.jenjang,
        id_kaprodi: prodi.id_kaprodi || ''
      });
    } else {
      setEditingProdi(null);
      setFormData({
        nama_prodi: '',
        kode_prodi: '',
        jenjang: 'S1',
        id_kaprodi: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProdi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProdi) {
        const { data } = await api.put(`/api/superadmin/prodi/${editingProdi.id}`, formData);
        if (data.success) {
          toast.success('Program studi berhasil diperbarui');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const { data } = await api.post('/api/superadmin/prodi', formData);
        if (data.success) {
          toast.success('Program studi baru berhasil ditambahkan');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data program studi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProdi = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program studi ini?')) return;
    
    try {
      const { data } = await api.delete(`/api/superadmin/prodi/${id}`);
      if (data.success) {
        toast.success('Program studi berhasil dihapus');
        fetchData();
      }
    } catch (error) {
      toast.error('Gagal menghapus program studi');
    }
  };

  const filteredProdis = prodis.filter(p => 
    p.nama_prodi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.kode_prodi && p.kode_prodi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <PageHeader 
        title="Manajemen Program Studi" 
        description="Daftar program studi di Universitas Siber Asia beserta pejabat Kaprodi yang bertanggung jawab."
      >
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-900/20">
          <Buildings size={20} weight="bold" /> Tambah Prodi
        </Button>
      </PageHeader>

      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Input 
              placeholder="Cari nama atau kode prodi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 px-4">Kode & Nama Prodi</th>
                <th className="pb-4 px-4 text-center">Jenjang</th>
                <th className="pb-4 px-4">Kaprodi</th>
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : filteredProdis.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400 italic">Tidak ada data program studi ditemukan.</td></tr>
              ) : (
                filteredProdis.map((prodi) => {
                  const kaprodi = kaprodis.find(k => k.id === prodi.id_kaprodi);
                  return (
                    <tr key={prodi.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-900">{prodi.nama_prodi}</p>
                        <p className="text-xs text-gray-400 font-medium">Kode: {prodi.kode_prodi || '-'}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="info">{prodi.jenjang}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        {kaprodi ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900">
                              <User size={14} weight="bold" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{kaprodi.nama_lengkap}</p>
                              <p className="text-[10px] text-gray-400">{kaprodi.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum ditentukan</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            className="w-9 h-9 p-0 rounded-full text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenModal(prodi)}
                          >
                            <PencilSimple size={18} weight="bold" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-9 h-9 p-0 rounded-full text-red hover:bg-red-50"
                            onClick={() => handleDeleteProdi(prodi.id)}
                          >
                            <Trash size={18} weight="bold" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Prodi Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProdi ? 'Edit Program Studi' : 'Tambah Prodi Baru'}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveProdi} isLoading={isSaving}>Simpan Data</Button>
          </>
        )}
      >
        <form className="space-y-6">
          <Input 
            label="Nama Program Studi" 
            placeholder="Contoh: PJJ Informatika" 
            value={formData.nama_prodi}
            onChange={(e) => setFormData({...formData, nama_prodi: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-6">
            <Input 
              label="Kode Prodi" 
              placeholder="Contoh: INF-01" 
              value={formData.kode_prodi}
              onChange={(e) => setFormData({...formData, kode_prodi: e.target.value})}
            />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Jenjang</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
                value={formData.jenjang}
                onChange={(e) => setFormData({...formData, jenjang: e.target.value as any})}
              >
                <option value="D3">D3</option>
                <option value="D4">D4</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Kaprodi Penanggung Jawab</label>
            <select 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
              value={formData.id_kaprodi}
              onChange={(e) => setFormData({...formData, id_kaprodi: e.target.value})}
            >
              <option value="">-- Pilih Kaprodi --</option>
              {kaprodis.map(u => (
                <option key={u.id} value={u.id}>{u.nama_lengkap} ({u.email})</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
