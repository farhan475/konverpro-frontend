'use client';

import React, { useState } from 'react';
import {
  CloudArrowUp,
  FileXls,
  FilePdf,
  Warning,
  Table,
  ArrowRight,
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function UploadPendaftarPage() {
  const [fileExcel, setFileExcel] = useState<File | null>(null);
  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const router = useRouter();

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
        setFileExcel(file);
      } else {
        toast.error('Format file harus Excel (.xlsx atau .xls)');
      }
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFilePdf(file);
      } else {
        toast.error('Format file harus PDF');
      }
    }
  };

  const handleUpload = async () => {
    if (!fileExcel) {
      toast.error('File Excel wajib diunggah');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file_excel', fileExcel);
    if (filePdf) {
      formData.append('file_pdf', filePdf);
    }

    try {
      const { data } = await api.post('/api/admin/pendaftar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success(`Berhasil mengunggah data ${data.data.length} mahasiswa`);
        router.push('/admin/pendaftar');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah data');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);

    try {
      const response = await api.get('/api/admin/template/download', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Template_Konversi_UNSIA.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal mengunduh template');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Unggah Data Pendaftar"
        description="Gunakan template Excel yang tersedia untuk mengunggah data mahasiswa dan transkrip nilai secara kolektif."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Table size={20} weight="bold" className="text-blue-900" />
              1. File Excel Transkrip (Wajib)
            </h3>

            <label className={cn(
              'relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer',
              fileExcel ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            )}>
              <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleExcelChange} />

              {fileExcel ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-900 mx-auto mb-4">
                    <FileXls size={32} weight="bold" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{fileExcel.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase">{(fileExcel.size / 1024).toFixed(1)} KB - Klik untuk mengganti</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <CloudArrowUp size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-600">Klik atau seret file Excel ke sini</p>
                  <p className="text-[11px] text-gray-400 mt-2 uppercase">Format: .xlsx atau .xls</p>
                </div>
              )}
            </label>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FilePdf size={20} weight="bold" className="text-red" />
              2. File PDF Asli (Opsional - Arsip)
            </h3>

            <label className={cn(
              'relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer',
              filePdf ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            )}>
              <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfChange} />

              {filePdf ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red mx-auto mb-4">
                    <FilePdf size={32} weight="bold" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{filePdf.name}</p>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase">{(filePdf.size / 1024).toFixed(1)} KB - Klik untuk mengganti</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                    <CloudArrowUp size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-600">Unggah PDF transkrip asli dari kampus asal</p>
                  <p className="text-[11px] text-gray-400 mt-2 uppercase">Hanya sebagai arsip pembanding</p>
                </div>
              )}
            </label>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="secondary" onClick={() => router.back()}>Batal</Button>
            <Button
              className="px-10 h-12 shadow-xl shadow-blue-900/20"
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={!fileExcel}
            >
              Proses & Simpan Data <ArrowRight size={18} weight="bold" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-blue-900 text-white border-none">
            <h3 className="text-lg font-bold mb-6">Instruksi Penting</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <p className="text-sm text-blue-100/80 font-medium">Pastikan nama program studi tujuan di Excel persis sama dengan yang ada di sistem.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p className="text-sm text-blue-100/80 font-medium">Gunakan Sheet 1 untuk data diri mahasiswa dan Sheet 2 untuk detail nilai.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow text-blue-900 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <p className="text-sm text-blue-100/80 font-medium">Relasi data antar sheet menggunakan kolom NIM Asal.</p>
              </li>
            </ul>

            <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[11px] font-bold text-yellow uppercase tracking-widest mb-3">Butuh Template?</p>
              <Button
                variant="secondary"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleDownloadTemplate}
                isLoading={isDownloadingTemplate}
              >
                Unduh Template .xlsx
              </Button>
            </div>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3">
              <Warning size={24} weight="bold" className="text-orange shrink-0" />
              <div>
                <h4 className="font-bold text-orange uppercase text-xs tracking-widest mb-1">Peringatan</h4>
                <p className="text-[11px] text-orange-900/70 font-medium leading-relaxed">
                  Data yang sudah diunggah akan langsung masuk ke antrean Akademik. Pastikan seluruh nilai dan SKS sudah benar sebelum mengklik tombol Simpan.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
