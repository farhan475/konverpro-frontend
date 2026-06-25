'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowsLeftRight,
  Info,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';
import { ApiResponse, KamusSinonim } from '@/lib/types';
import { toast } from 'sonner';

interface KamusSinonimManagerProps {
  endpoint: string;
}

type KamusSinonimResponse = KamusSinonim[] | {
  data: KamusSinonim[];
};

export function KamusSinonimManager({ endpoint }: KamusSinonimManagerProps) {
  const [items, setItems] = useState<KamusSinonim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KamusSinonim | null>(null);
  const [formData, setFormData] = useState({
    kata_utama: '',
    sinonim: '',
    keterangan: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<KamusSinonimResponse>>(endpoint);
      if (data.success) {
        setItems(Array.isArray(data.data) ? data.data : data.data.data);
      }
    } catch {
      toast.error('Gagal mengambil data kamus sinonim');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenModal = (item: KamusSinonim | null = null) => {
    setEditingItem(item);
    setFormData(item
      ? {
          kata_utama: item.kata_utama,
          sinonim: item.sinonim,
          keterangan: item.keterangan || '',
        }
      : { kata_utama: '', sinonim: '', keterangan: '' });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = editingItem
        ? await api.put(`${endpoint}/${editingItem.id}`, formData)
        : await api.post(endpoint, formData);
      if (data.success) {
        toast.success(editingItem ? 'Pasangan sinonim berhasil diperbarui' : 'Pasangan sinonim berhasil ditambahkan');
        setIsModalOpen(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (error) {
      const message = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      toast.error(message || 'Gagal menyimpan data kamus sinonim');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasangan sinonim ini?')) return;

    try {
      const { data } = await api.delete(`${endpoint}/${id}`);
      if (data.success) {
        toast.success('Pasangan sinonim berhasil dihapus');
        fetchItems();
      }
    } catch {
      toast.error('Gagal menghapus data');
    }
  };

  const filteredItems = items.filter((item) =>
    item.kata_utama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sinonim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Kamus Sinonim"
        description="Daftar padanan nama mata kuliah untuk meningkatkan akurasi otomasi matching SKS oleh AI."
      >
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-900/20">
          <Plus size={20} weight="bold" /> Tambah Sinonim
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="relative mb-6">
              <Input
                placeholder="Cari kata utama atau sinonim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11"
              />
              <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 px-4">Kata Utama</th>
                    <th className="pb-4 px-4 text-center"><ArrowsLeftRight size={16} className="mx-auto" /></th>
                    <th className="pb-4 px-4">Sinonim</th>
                    <th className="pb-4 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">Memuat data...</td></tr>
                  ) : filteredItems.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-400 italic">Tidak ada data ditemukan.</td></tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-blue-900">{item.kata_utama}</td>
                        <td className="py-4 px-4 text-center text-gray-300"><ArrowsLeftRight size={14} /></td>
                        <td className="py-4 px-4 font-medium text-gray-700">
                          {item.sinonim}
                          {item.keterangan && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.keterangan}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              className="w-9 h-9 p-0 rounded-full text-blue-700 hover:bg-blue-50"
                              onClick={() => handleOpenModal(item)}
                              title="Edit sinonim"
                            >
                              <PencilSimple size={18} weight="bold" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-9 h-9 p-0 rounded-full text-red hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                              title="Hapus sinonim"
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
        </div>

        <div>
          <Card className="bg-blue-50 border-blue-100">
            <div className="flex items-center gap-3 mb-4 text-blue-900">
              <Info size={24} weight="bold" />
              <h3 className="font-bold">Cara Kerja</h3>
            </div>
            <p className="text-sm text-blue-900/70 leading-relaxed mb-4">
              Sistem matching menormalkan nama mata kuliah dari transkrip asal menggunakan kamus ini sebelum perbandingan fuzzy.
            </p>
            <div className="p-3 bg-white rounded-xl border border-blue-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contoh Input</p>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <span>Pencasila</span>
                <ArrowsLeftRight size={12} />
                <span>Pendidikan Pancasila</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Pasangan Sinonim' : 'Tambah Pasangan Sinonim'}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveItem} isLoading={isSaving}>Simpan Data</Button>
          </>
        )}
      >
        <form className="space-y-6">
          <Input
            label="Kata Utama"
            placeholder="Contoh: Pendidikan Kewarganegaraan"
            value={formData.kata_utama}
            onChange={(e) => setFormData({ ...formData, kata_utama: e.target.value })}
            required
          />
          <Input
            label="Sinonim"
            placeholder="Contoh: PKN / Kewarganegaraan"
            value={formData.sinonim}
            onChange={(e) => setFormData({ ...formData, sinonim: e.target.value })}
            required
          />
          <Input
            label="Keterangan (Opsional)"
            placeholder="Misal: Sering muncul di transkrip PTN"
            value={formData.keterangan}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}
