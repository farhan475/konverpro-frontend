'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  MagnifyingGlass
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';
import { ApiResponse, Prodi } from '@/lib/types';
import { toast } from 'sonner';

interface KurikulumMk {
  id: string;
  id_prodi: string;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  tipe_mk: 'Wajib' | 'Pilihan';
  prodi?: Prodi;
}

export default function KurikulumManagementPage() {
  const [items, setItems] = useState<KurikulumMk[]>([]);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProdi, setSelectedProdi] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KurikulumMk | null>(null);
  const [formData, setFormData] = useState<{
    id_prodi: string;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
    tipe_mk: 'Wajib' | 'Pilihan';
  }>({
    id_prodi: '',
    kode_mk: '',
    nama_mk: '',
    sks: 3,
    semester: 1,
    tipe_mk: 'Wajib'
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mkRes, prodiRes] = await Promise.all([
        api.get<ApiResponse<KurikulumMk[]>>('/api/akademik/kurikulum'),
        api.get<ApiResponse<Prodi[]>>('/api/referensi/prodi') 
      ]);
      
      if (mkRes.data.success) setItems(mkRes.data.data);
      if (prodiRes.data.success) setProdis(prodiRes.data.data);
    } catch {
      toast.error('Gagal mengambil data kurikulum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item: KurikulumMk | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        id_prodi: item.id_prodi,
        kode_mk: item.kode_mk || '',
        nama_mk: item.nama_mk,
        sks: item.sks,
        semester: item.semester,
        tipe_mk: item.tipe_mk
      });
    } else {
      setEditingItem(null);
      setFormData({
        id_prodi: selectedProdi || (prodis[0]?.id || ''),
        kode_mk: '',
        nama_mk: '',
        sks: 3,
        semester: 1,
        tipe_mk: 'Wajib'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_prodi) {
      toast.error('Silakan pilih program studi');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await api.put(`/api/akademik/kurikulum/${editingItem.id}`, formData);
        toast.success('Mata kuliah berhasil diperbarui');
      } else {
        await api.post('/api/akademik/kurikulum', formData);
        toast.success('Mata kuliah baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus mata kuliah ini dari kurikulum?')) return;
    try {
      await api.delete(`/api/akademik/kurikulum/${id}`);
      toast.success('Mata kuliah berhasil dihapus');
      fetchData();
    } catch {
      toast.error('Gagal menghapus data');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.nama_mk.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.kode_mk && item.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProdi = selectedProdi ? item.id_prodi === selectedProdi : true;
    return matchesSearch && matchesProdi;
  });

  return (
    <div>
      <PageHeader 
        title="Manajemen Kurikulum" 
        description="Kelola daftar mata kuliah standard untuk setiap program studi di lingkungan UNSIA."
      >
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-900/20">
          <Plus size={20} weight="bold" /> Tambah Mata Kuliah
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Input 
              placeholder="Cari nama atau kode MK..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Filter Prodi:</label>
            <select 
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-700/10 min-w-[200px]"
              value={selectedProdi}
              onChange={(e) => setSelectedProdi(e.target.value)}
            >
              <option value="">Semua Program Studi</option>
              {prodis.map(p => (
                <option key={p.id} value={p.id}>{p.nama_prodi}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 px-4">Kode & Nama MK</th>
                <th className="pb-4 px-4 text-center">SKS</th>
                <th className="pb-4 px-4 text-center">Smstr</th>
                <th className="pb-4 px-4 text-center">Tipe</th>
                {!selectedProdi && <th className="pb-4 px-4">Program Studi</th>}
                <th className="pb-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Memuat kurikulum...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400 italic font-medium">Belum ada data mata kuliah.</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{item.nama_mk}</p>
                      <p className="text-[11px] text-gray-400 font-medium">KODE: {item.kode_mk || '-'}</p>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-blue-900">
                      {item.sks}
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-gray-600">
                      {item.semester}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={item.tipe_mk === 'Wajib' ? 'neutral' : 'info'}>
                        {item.tipe_mk}
                      </Badge>
                    </td>
                    {!selectedProdi && (
                      <td className="py-4 px-4">
                        <p className="text-xs font-semibold text-gray-500 truncate max-w-[150px]">
                          {item.prodi?.nama_prodi}
                        </p>
                      </td>
                    )}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          className="w-9 h-9 p-0 rounded-full text-blue-700 hover:bg-blue-50"
                          onClick={() => handleOpenModal(item)}
                        >
                          <PencilSimple size={18} weight="bold" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-9 h-9 p-0 rounded-full text-red hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
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

      {/* MK Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} isLoading={isSaving}>Simpan Data</Button>
          </>
        )}
      >
        <form className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Program Studi</label>
            <select 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
              value={formData.id_prodi}
              onChange={(e) => setFormData({...formData, id_prodi: e.target.value})}
              required
            >
              <option value="">-- Pilih Prodi --</option>
              {prodis.map(p => (
                <option key={p.id} value={p.id}>{p.nama_prodi}</option>
              ))}
            </select>
          </div>
          
          <Input 
            label="Nama Mata Kuliah" 
            placeholder="Contoh: Pemrograman Berorientasi Objek" 
            value={formData.nama_mk}
            onChange={(e) => setFormData({...formData, nama_mk: e.target.value})}
            required
          />

          <div className="grid grid-cols-3 gap-6">
            <Input 
              label="Kode MK" 
              placeholder="INF101" 
              value={formData.kode_mk}
              onChange={(e) => setFormData({...formData, kode_mk: e.target.value})}
            />
            <Input 
              label="SKS" 
              type="number"
              value={formData.sks}
              onChange={(e) => setFormData({...formData, sks: parseInt(e.target.value) || 0})}
              required
            />
            <Input 
              label="Semester" 
              type="number"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value) || 0})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">Tipe Mata Kuliah</label>
            <div className="flex gap-4">
              {['Wajib', 'Pilihan'].map((tipe) => (
                <label key={tipe} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    className="w-4 h-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    checked={formData.tipe_mk === tipe}
                    onChange={() => setFormData({...formData, tipe_mk: tipe as 'Wajib' | 'Pilihan'})}
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">{tipe}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
