'use client';

import React, { useState, useEffect } from 'react';
import { 
  Signature, 
  CloudArrowUp, 
  Trash, 
  CheckCircle,
  Warning,
  Info,
  PencilLine
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SignaturePad } from '@/components/shared/SignaturePad';
import api from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TandaTanganPage() {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');

  const fetchSignature = async () => {
    setLoading(true);
    try {
      const { data: userRes } = await api.get('/api/auth/me');
      if (userRes.success && userRes.data.tanda_tangan_path) {
        const response = await api.get('/api/files/signature', { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        setSignatureUrl(url);
      } else {
        setSignatureUrl(null);
      }
    } catch (error) {
      setSignatureUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignature();
    return () => {
      if (signatureUrl) URL.revokeObjectURL(signatureUrl);
    };
  }, []);

  const handleUploadBlob = async (blob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('tanda_tangan', blob, 'signature.png');

    try {
      const { data } = await api.post('/api/kaprodi/tanda-tangan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('Tanda tangan berhasil disimpan');
        fetchSignature();
      }
    } catch (error) {
      toast.error('Gagal menyimpan tanda tangan');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadBlob(e.target.files[0]);
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
        description="Unggah atau buat goresan tanda tangan digital Anda untuk pengesahan Berita Acara Konversi SKS."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Toggle Mode */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
            <button 
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2",
                mode === 'draw' ? "bg-white text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setMode('draw')}
            >
              <PencilLine size={18} weight="bold" /> Gores Langsung
            </button>
            <button 
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2",
                mode === 'upload' ? "bg-white text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setMode('upload')}
            >
              <CloudArrowUp size={18} weight="bold" /> Unggah File
            </button>
          </div>

          <Card className="flex flex-col items-center justify-center py-12 min-h-[450px]">
            {loading ? (
              <div className="w-full max-w-md h-64 bg-gray-50 animate-pulse rounded-3xl" />
            ) : signatureUrl ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-8">Tanda Tangan Aktif</h3>
                <div className="relative group mx-auto">
                  <div className="w-80 h-48 bg-white border-2 border-blue-100 rounded-3xl flex items-center justify-center p-4 overflow-hidden shadow-lg shadow-blue-900/5">
                    <img src={signatureUrl} alt="Tanda Tangan" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-4 bg-white text-red rounded-full hover:scale-110 transition-transform shadow-xl flex items-center gap-2 font-bold text-xs uppercase"
                    >
                      <Trash size={20} weight="bold" /> Hapus Sekarang
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle size={20} weight="bold" />
                  <p className="text-sm font-bold uppercase tracking-widest">Siap Digunakan di Berita Acara</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {mode === 'draw' ? (
                  <SignaturePad onSave={handleUploadBlob} isSaving={isUploading} />
                ) : (
                  <label className="w-full max-w-xl mx-auto h-72 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all group">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-300 mb-6 shadow-sm group-hover:text-blue-900 group-hover:scale-110 transition-all">
                      <CloudArrowUp size={40} weight="bold" />
                    </div>
                    <p className="text-lg font-bold text-gray-500 group-hover:text-blue-900">Pilih File Tanda Tangan</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Format: PNG (Transparent) / JPG</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-900 mb-4 flex items-center gap-2">
              <Info size={16} weight="bold" /> Ketentuan Tanda Tangan
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium"><b>Gores Langsung</b>: Gunakan mouse, stylus, atau jari Anda pada area canvas yang disediakan.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium"><b>Unggah File</b>: Pastikan menggunakan gambar dengan latar belakang transparan agar terlihat rapi di PDF.</p>
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
