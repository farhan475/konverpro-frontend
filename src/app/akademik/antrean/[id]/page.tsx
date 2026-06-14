'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Buildings, 
  FileXls, 
  MagicWand, 
  CheckCircle,
  Warning,
  Table,
  Info
} from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { ApiResponse, Pendaftar, StatusPendaftar } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DetailAntreanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [pendaftar, setPendaftar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>(`/api/akademik/antrean/${id}`);
      if (data.success) {
        setPendaftar(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil detail pendaftar');
      router.push('/akademik/antrean');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleProsesMatching = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.post(`/api/akademik/antrean/${id}/proses`);
      if (data.success) {
        toast.success('Proses matching AI berhasil dimulai');
        router.push('/akademik/antrean');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memulai proses matching');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Detail...</div>;

  return (
    <div>
      <PageHeader 
        title="Review Data Pendaftar" 
        description="Periksa kembali data hasil parsing Excel sebelum dikirim ke mesin AI untuk proses pemetaan mata kuliah."
      >
        <Button variant="secondary" onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <ArrowLeft size={18} weight="bold" /> Kembali
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Data Mahasiswa */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} weight="bold" className="text-blue-900" />
              Profil Mahasiswa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NIM Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.nim_asal || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Program Studi Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.asal_prodi || '-'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Universitas Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.asal_kampus || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prodi Tujuan (UNSIA)</p>
                  <Badge variant="info" className="text-xs">{pendaftar.prodi?.nama_prodi}</Badge>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Saat Ini</p>
                  <Badge variant="neutral" className="text-xs uppercase">{pendaftar.status}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabel Transkrip Asal */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Table size={20} weight="bold" className="text-blue-900" />
              Transkrip Nilai (Hasil Parsing)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 px-2">Nama Mata Kuliah Asal</th>
                    <th className="pb-4 px-2 text-center">SKS</th>
                    <th className="pb-4 px-2 text-center">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendaftar.transkrip_asal?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-4 px-2 font-bold text-gray-700">{item.nama_mk_asal}</td>
                      <td className="py-4 px-2 text-center font-medium text-gray-600">{item.sks_asal}</td>
                      <td className="py-4 px-2 text-center">
                        <span className="px-2 py-1 rounded bg-gray-100 text-[11px] font-bold text-gray-600 border border-gray-200">
                          {item.nilai_huruf_asal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="bg-blue-900 text-white border-none shadow-xl shadow-blue-900/20">
            <h3 className="text-lg font-bold mb-4">Aksi Akademik</h3>
            <p className="text-blue-100/70 text-sm mb-8 leading-relaxed">
              Jika data parsing di samping sudah benar, silakan klik tombol di bawah untuk memicu proses matching otomatis menggunakan AI.
            </p>
            
            <Button 
              className="w-full py-4 bg-yellow text-blue-900 hover:bg-yellow/90 font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3"
              onClick={handleProsesMatching}
              isLoading={isProcessing}
              disabled={pendaftar.status !== 'Baru' && pendaftar.status !== 'Revisi'}
            >
              <MagicWand size={20} weight="bold" />
              Proses Matching AI
            </Button>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex gap-3">
                <Info size={20} weight="bold" className="text-yellow shrink-0" />
                <p className="text-[11px] text-blue-100/60 leading-relaxed italic">
                  Proses ini memakan waktu 5-10 detik. Sistem akan mencocokkan setiap MK asal dengan kurikulum UNSIA.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Dokumen Pendukung</h4>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start text-xs font-bold bg-white"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/excel/${pendaftar.id}`)}
              >
                <FileXls size={18} weight="bold" className="text-green-600" /> Lihat Excel Original
              </Button>
              {pendaftar.file_transkrip_pdf_path && (
                <Button 
                  variant="secondary" 
                  className="w-full justify-start text-xs font-bold bg-white"
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/pdf/${pendaftar.id}`)}
                >
                  <FilePdf size={18} weight="bold" className="text-red-600" /> Lihat PDF Arsip
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
