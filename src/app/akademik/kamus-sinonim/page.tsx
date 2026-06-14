'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash, 
  MagnifyingGlass,
  BookOpen,
  ArrowsLeftRight,
  Info
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

interface KamusSinonim {
  id: string;
  kata_utama: string;
  sinonim: string;
  keterangan?: string;
  is_active: boolean;
}

export default function KamusSinonimPage() {
  const [items, setItems] = useState<KamusSinonim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kata_utama: '',
    sinonim: '',
    keterangan: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<KamusSinonim[]>>('/api/akademik/kamus-sinonim');
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data kamus sinonim');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      kata_utama: '',
      sinonim: '',
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.post('/api/akademik/kamus-sinonim', formData);
      if (data.success) {
        toast.success('Pasangan sinonim berhasil ditambahkan');
        setIsModalOpen(false);
        fetchItems();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data kamus sinonim');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasangan sinonim ini?')) return;
    
    try {
      const { data } = await api.delete(`/api/akademik/kamus-sinonim/${id}`);
      if (data.success) {
        toast.success('Pasangan sinonim berhasil dihapus');
        fetchItems();
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const filteredItems = items.filter(item => 
    item.kata_utama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sinonim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Kamus Sinonim" 
        description="Daftar padanan nama mata kuliah untuk meningkatkan akurasi otomasi matching SKS oleh AI."
      >
        <Button onClick={handleOpenModal} className="shadow-lg shadow-blue-900/20">
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
                    <th className="pb-4 px-4">Kata Utama (Standard)</th>
                    <th className="pb-4 px-4 text-center"><ArrowsLeftRight size={16} className="mx-auto" /></th>
                    <th className="pb-4 px-4">Sinonim (Varian)</th>
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
                        <td className="py-4 px-4 font-bold text-blue-900">
                          {item.kata_utama}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-300">
                          <ArrowsLeftRight size={14} />
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-700">
                          {item.sinonim}
                          {item.keterangan && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.keterangan}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            className="w-9 h-9 p-0 rounded-full text-red hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash size={18} weight="bold" />
                          </Button>
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
              Sistem matching akan mencoba menormalkan nama mata kuliah dari transkrip asal menggunakan kamus ini sebelum melakukan perbandingan fuzzy.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contoh Input</p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <span>Pencasila</span>
                  <ArrowsLeftRight size={12} />
                  <span>Pendidikan Pancasila</span>
                </div>
              </div>
              <p className="text-[11px] text-blue-900/50 italic">
                * Input varian yang sering muncul di transkrip luar agar sistem bisa langsung mengenali mata kuliah tujuannya.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Pasangan Sinonim"
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveItem} isLoading={isSaving}>Simpan Data</Button>
          </>
        )}
      >
        <form className="space-y-6">
          <Input 
            label="Kata Utama (Nama Standard Kurikulum)" 
            placeholder="Contoh: Pendidikan Kewarganegaraan" 
            value={formData.kata_utama}
            onChange={(e) => setFormData({...formData, kata_utama: e.target.value})}
            required
          />
          <Input 
            label="Sinonim (Varian dari Kampus Luar)" 
            placeholder="Contoh: PKN / Kewarganegaraan" 
            value={formData.sinonim}
            onChange={(e) => setFormData({...formData, sinonim: e.target.value})}
            required
          />
          <Input 
            label="Keterangan (Opsional)" 
            placeholder="Misal: Sering muncul di transkrip PTN" 
            value={formData.keterangan}
            onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
          />
        </form>
      </Modal>
    </div>
  );
}
