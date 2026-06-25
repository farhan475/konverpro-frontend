'use client';

import React, { useState, useEffect } from 'react';
import {
  PenNib,
  Trash,
  UploadSimple,
  CheckCircle,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

interface TandaTanganData {
  has_tanda_tangan: boolean;
  tanda_tangan_url: string | null;
  uploaded_at: string | null;
}

export default function TandaTanganPage() {
  const [data, setData] = useState<TandaTanganData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<TandaTanganData>>('/api/kaprodi/tanda-tangan')
      .then(({ data: res }) => { if (res.success) setData(res.data); })
      .catch(() => toast.error('Gagal memuat'))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('Ukuran file maksimal 1 MB');
      return;
    }

    if (file.type !== 'image/png') {
      toast.error('Format file harus PNG');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: res } = await api.post<ApiResponse<TandaTanganData>>('/api/kaprodi/tanda-tangan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
        toast.success('Tanda tangan berhasil diupload');
        location.reload();
      } else {
        toast.error('Gagal mengupload');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data: res } = await api.delete<ApiResponse<null>>('/api/kaprodi/tanda-tangan');
      if (res.success) {
        toast.success('Tanda tangan berhasil dihapus');
        setData((prev) => prev ? { ...prev, has_tanda_tangan: false, tanda_tangan_url: null, uploaded_at: null } : null);
      }
    } catch {
      toast.error('Gagal menghapus tanda tangan');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tanda Tangan Digital"
        description="Unggah tanda tangan digital Anda yang akan digunakan pada Berita Acara Konversi."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              <PenNib size={20} weight="bold" className="text-blue-900 inline mr-2" />
              Unggah Tanda Tangan
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {/* Preview area */}
                <div className="flex flex-col items-center justify-center mb-8">
                  {data?.has_tanda_tangan && data.tanda_tangan_url ? (
                    <div className="w-64 h-32 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center p-4 mb-4">
                      <img
                        src={data.tanda_tangan_url}
                        alt="Tanda Tangan"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-4">
                      <p className="text-sm text-gray-400">Belum ada tanda tangan</p>
                    </div>
                  )}
                  {data?.uploaded_at && (
                    <p className="text-xs text-gray-400">Terakhir diunggah: {data.uploaded_at}</p>
                  )}
                </div>

                {/* Upload area */}
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-sm font-bold text-gray-600">Mengunggah...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-900 mx-auto mb-4">
                        <UploadSimple size={32} weight="bold" />
                      </div>
                      <p className="text-sm font-bold text-gray-600">
                        {data?.has_tanda_tangan ? 'Klik untuk mengganti' : 'Klik atau seret file PNG ke sini'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-2 uppercase">Format: PNG, Maks 1 MB</p>
                    </div>
                  )}
                </label>

                {data?.has_tanda_tangan && (
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="danger"
                      onClick={() => setShowConfirmDelete(true)}
                      isLoading={isDeleting}
                    >
                      <Trash size={16} weight="bold" />
                      Hapus Tanda Tangan
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-blue-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6">Ketentuan</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <p className="text-sm text-blue-100/80 font-medium">
                  Gunakan tanda tangan asli yang discan dengan latar belakang transparan.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p className="text-sm text-blue-100/80 font-medium">
                  Format file PNG dengan ukuran maksimal 1 MB.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <p className="text-sm text-blue-100/80 font-medium">
                  Tanda tangan akan otomatis tercantum pada Berita Acara Konversi yang disetujui.
                </p>
              </li>
            </ul>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle size={24} weight="bold" className="text-green shrink-0" />
              <div>
                <h4 className="font-bold text-green uppercase text-xs tracking-widest mb-1">Info</h4>
                <p className="text-[11px] text-green-900/70 font-medium leading-relaxed">
                  Tanda tangan digital bersifat privat. Hanya Anda yang dapat mengunggah, melihat, dan menghapusnya.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Tanda Tangan"
        message="Apakah Anda yakin ingin menghapus tanda tangan digital? Tanda tangan yang sudah tercantum di Berita Acara yang sudah disetujui tidak akan terpengaruh."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
