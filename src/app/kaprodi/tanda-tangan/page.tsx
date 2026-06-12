'use client';

import React, { useState, useEffect } from 'react';
import { 
  Signature, 
  CloudArrowUp, 
  Trash, 
  CheckCircle,
  Warning,
  Info
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TandaTanganPage() {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSignature = async () => {
    setLoading(true);
    try {
      // Assuming /api/auth/me returns the user data with tanda_tangan_path
      const { data } = await api.get('/api/auth/me');
      if (data.success && data.data.tanda_tangan_path) {
        setSignatureUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${data.data.tanda_tangan_path}`);
      }
    } catch (error) {
      toast.error('Gagal mengambil data tanda tangan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignature();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Format file harus gambar (PNG/JPG)');
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('tanda_tangan', file);

      try {
        const { data } = await api.post('/api/kaprodi/tanda-tangan', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (data.success) {
          toast.success('Tanda tangan berhasil diperbarui');
          fetchSignature();
        }
      } catch (error) {
        toast.error('Gagal mengunggah tanda tangan');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus tanda tangan digital Anda?')) return;
    setIsDeleting(true);
    try {
      const { data } = await api.delete('/api/kaprodi/tanda-tangan');
      if (data.success) {
        toast.success('Tanda tangan berhasil dihapus');
        setSignatureUrl(null);
      }
    } catch (error) {
      toast.error('Gagal menghapus tanda tangan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Tanda Tangan Digital" 
        description="Unggah tanda tangan digital Anda untuk disematkan pada dokumen Berita Acara Konversi yang telah disetujui."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Preview Tanda Tangan</h3>
            
            {loading ? (
              <div className="w-64 h-40 bg-gray-50 animate-pulse rounded-2xl" />
            ) : signatureUrl ? (
              <div className="relative group">
                <div className="w-80 h-48 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center p-4 overflow-hidden shadow-inner">
                  <img src={signatureUrl} alt="Tanda Tangan" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-4">
                  <label className="p-3 bg-white text-blue-900 rounded-full cursor-pointer hover:scale-110 transition-transform">
                    <CloudArrowUp size={24} weight="bold" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-3 bg-red text-white rounded-full hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    <Trash size={24} weight="bold" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-80 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                  <Signature size={32} />
                </div>
                <p className="text-sm font-bold text-gray-500">Unggah Tanda Tangan</p>
                <p className="text-[11px] text-gray-400 mt-1 uppercase">Format: PNG (Transparent) / JPG</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}

            {signatureUrl && (
              <div className="mt-8 flex items-center gap-2 text-green-600">
                <CheckCircle size={20} weight="bold" />
                <p className="text-sm font-bold uppercase tracking-widest">Tanda Tangan Aktif</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-900 mb-4 flex items-center gap-2">
              <Info size={16} weight="bold" /> Ketentuan File
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">Gunakan latar belakang <b>Transparan (PNG)</b> untuk hasil terbaik di dokumen PDF.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">Pastikan tanda tangan terlihat jelas (kontras tinggi) dan tidak terpotong.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">Ukuran file maksimal adalah 2MB.</p>
              </li>
            </ul>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <div className="flex gap-3 text-orange-700">
              <Warning size={24} weight="bold" className="shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-tight mb-1">Penting</p>
                <p className="text-[11px] font-medium leading-relaxed italic">
                  Tanda tangan ini memiliki kekuatan hukum yang sah di lingkungan UNSIA untuk pengesahan Berita Acara Konversi SKS.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
