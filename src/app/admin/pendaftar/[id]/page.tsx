'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Table,
  Clock,
  CheckCircle,
  XCircle,
  FileXls,
  FilePdf,
  Info
} from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getStatusVariant } from '@/lib/utils/status';
import { downloadBlob } from '@/lib/utils/download';
import api from '@/lib/api';
import { ApiResponse, StatusPendaftar } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminDetailPendaftarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [pendaftar, setPendaftar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>(`/api/admin/pendaftar/${id}`);
      if (data.success) {
        setPendaftar(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil detail pendaftar');
      router.push('/admin/pendaftar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Detail...</div>;

  return (
    <div>
      <PageHeader
        title="Detail Pendaftar"
        description="Lihat informasi lengkap mahasiswa dan status terkini dari proses konversi SKS."
      >
        <Button variant="secondary" onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <ArrowLeft size={18} weight="bold" /> Kembali
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Status Timeline / Card */}
          <Card className={cn(
            "border-l-8",
            pendaftar.status === 'Approved' ? "border-green" :
            pendaftar.status === 'Rejected' ? "border-red" : "border-blue-900"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Permohonan</p>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusVariant(pendaftar.status)} className="text-sm px-4 py-1">
                    {pendaftar.status}
                  </Badge>
                  {pendaftar.status === 'Approved' && (
                    <span className="text-green font-bold text-sm flex items-center gap-1">
                      <CheckCircle size={18} weight="fill" /> {pendaftar.total_sks_diakui} SKS Diakui
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Terakhir Diupdate</p>
                <p className="text-sm font-bold text-gray-900">{new Date(pendaftar.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {pendaftar.catatan_revisi && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-[10px] font-bold text-orange uppercase mb-1 flex items-center gap-2">
                  <Info size={16} /> Catatan Revisi / Penolakan:
                </p>
                <p className="text-sm text-orange-900 font-medium italic">"{pendaftar.catatan_revisi}"</p>
              </div>
            )}
          </Card>

          {/* Profil Mahasiswa */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} weight="bold" className="text-blue-900" />
              Informasi Mahasiswa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nama Lengkap</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">NIM Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.nim_asal || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Program Studi Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.asal_prodi || '-'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Universitas Asal</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.asal_kampus || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email / WhatsApp</p>
                  <p className="text-sm font-bold text-gray-900">{pendaftar.email || '-'} / {pendaftar.no_whatsapp || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Prodi Tujuan (UNSIA)</p>
                  <Badge variant="info">{pendaftar.prodi?.nama_prodi}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabel Hasil Konversi (Hanya muncul jika sudah diproses) */}
          {pendaftar.hasil_konversi && pendaftar.hasil_konversi.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Table size={20} weight="bold" className="text-blue-900" />
                Daftar Pemetaan Mata Kuliah
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-4 px-2">MK Asal</th>
                      <th className="pb-4 px-2">MK Tujuan (UNSIA)</th>
                      <th className="pb-4 px-2 text-center">SKS</th>
                      <th className="pb-4 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendaftar.hasil_konversi.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-4 px-2">
                          <p className="font-bold text-gray-900">{item.transkrip_asal?.nama_mk_asal}</p>
                          <p className="text-[10px] text-gray-400">Nilai: {item.transkrip_asal?.nilai_huruf_asal}</p>
                        </td>
                        <td className="py-4 px-2">
                          {item.mk_tujuan ? (
                            <p className="font-bold text-blue-900">{item.mk_tujuan.nama_mk}</p>
                          ) : (
                            <span className="text-gray-400 italic">Belum dipetakan</span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-center font-bold">{item.sks_diakui}</td>
                        <td className="py-4 px-2 text-center">
                          <Badge variant={item.is_unmatched ? 'neutral' : 'success'}>
                            {item.is_unmatched ? 'Manual' : 'Matched'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Lampiran Berkas</h4>
            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-start text-xs font-bold bg-white"
                onClick={() => downloadBlob(`/api/files/excel/${id}`, `Transkrip_${pendaftar.nama_lengkap}.xlsx`)}
              >
                <FileXls size={18} weight="bold" className="text-green-600" /> Transkrip Excel
              </Button>
              {pendaftar.file_transkrip_pdf_path && (
                <Button
                  variant="secondary"
                  className="w-full justify-start text-xs font-bold bg-white"
                  onClick={() => downloadBlob(`/api/files/pdf/${id}`, `Transkrip_${pendaftar.nama_lengkap}.pdf`)}
                >
                  <FilePdf size={18} weight="bold" className="text-red-600" /> Transkrip PDF Asli
                </Button>
              )}
            </div>
          </Card>

          {pendaftar.status === 'Approved' && (
            <Card className="bg-green-50 border-green-200">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-green text-white flex items-center justify-center shrink-0">
                  <CheckCircle size={24} weight="bold" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm">Konversi Selesai</h4>
                  <p className="text-xs text-green-800/70 mt-1 leading-relaxed">
                    Mahasiswa ini telah disetujui untuk konversi SKS. Berita Acara (BA) telah diterbitkan dan notifikasi telah dikirimkan.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
