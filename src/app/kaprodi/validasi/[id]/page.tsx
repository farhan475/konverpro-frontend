'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Table, 
  CheckCircle, 
  XCircle, 
  Clock, 
  PencilSimple,
  FloppyDisk,
  Warning,
  Info,
  MagicWand,
  ArrowRight,
  FilePdf
} from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { ApiResponse, Prodi } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DetailValidasiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [pendaftar, setPendaftar] = useState<any>(null);
  const [kurikulum, setKurikulum] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Action state
  const [isApproving, setIsApproving] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [catatan, setCatatan] = useState('');
  
  // Modal states
  const [isRevisiModalOpen, setIsRevisiModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [detailRes, kurikulumRes] = await Promise.all([
        api.get<ApiResponse<any>>(`/api/kaprodi/validasi/${id}`),
        api.get<ApiResponse<any[]>>('/api/akademik/kurikulum') // Kaprodi can see kurikulum
      ]);
      
      if (detailRes.data.success) setPendaftar(detailRes.data.data);
      if (kurikulumRes.data.success) setKurikulum(kurikulumRes.data.data);
    } catch (error) {
      toast.error('Gagal mengambil detail validasi');
      router.push('/kaprodi/validasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleUpdateHasil = async (hasilId: string, payload: any) => {
    try {
      const { data } = await api.put(`/api/kaprodi/hasil-konversi/${hasilId}`, payload);
      if (data.success) {
        toast.success('Berhasil memperbarui pemetaan');
        fetchDetail(); // Refresh data
      }
    } catch (error) {
      toast.error('Gagal memperbarui pemetaan');
    }
  };

  const handleApprove = async () => {
    if (!confirm('Apakah Anda yakin ingin menyetujui permohonan ini?')) return;
    setIsApproving(true);
    try {
      const { data } = await api.post(`/api/kaprodi/validasi/${id}/approve`);
      if (data.success) {
        toast.success('Permohonan berhasil disetujui');
        router.push('/kaprodi/validasi');
      }
    } catch (error) {
      toast.error('Gagal memberikan persetujuan');
    } finally {
      setIsApproving(false);
    }
  };

  const handleRevisi = async () => {
    if (!catatan) return toast.error('Catatan revisi wajib diisi');
    setIsRevising(true);
    try {
      const { data } = await api.post(`/api/kaprodi/validasi/${id}/revisi`, { catatan: catatan });
      if (data.success) {
        toast.success('Permohonan dikembalikan untuk revisi');
        router.push('/kaprodi/validasi');
      }
    } catch (error) {
      toast.error('Gagal memproses revisi');
    } finally {
      setIsRevising(false);
    }
  };

  const handleReject = async () => {
    if (!catatan) return toast.error('Alasan penolakan wajib diisi');
    setIsRejecting(true);
    try {
      const { data } = await api.post(`/api/kaprodi/validasi/${id}/reject`, { alasan: catatan });
      if (data.success) {
        toast.success('Permohonan telah ditolak');
        router.push('/kaprodi/validasi');
      }
    } catch (error) {
      toast.error('Gagal memproses penolakan');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDownloadBa = async () => {
    try {
      const response = await api.get(`/api/kaprodi/validasi/${id}/download-ba`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Berita_Acara_${pendaftar.nim_asal || pendaftar.nama_lengkap}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Gagal mengunduh Berita Acara');
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Data Validasi...</div>;

  const totalSksDiakui = pendaftar.hasil_konversi?.reduce((acc: number, curr: any) => acc + (curr.sks_diakui || 0), 0) || 0;
  const totalSksKurikulum = pendaftar.prodi?.kurikulum_mk?.reduce((acc: number, curr: any) => acc + (curr.sks || 0), 0) || 0;
  const maxSksPersen = pendaftar.prodi?.pengaturan?.max_konversi_sks_persen || 70;
  const maxSksLimit = Math.floor((maxSksPersen / 100) * totalSksKurikulum);
  const isOverLimit = totalSksDiakui > maxSksLimit && totalSksKurikulum > 0;

  return (
    <div>
      <PageHeader 
        title="Detail Validasi Konversi" 
        description="Review hasil pemetaan otomatis dan berikan keputusan akhir permohonan konversi."
      >
        <Button variant="secondary" onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <ArrowLeft size={18} weight="bold" /> Kembali
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Info Mahasiswa */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-xl">
                  {pendaftar.nama_lengkap.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pendaftar.nama_lengkap}</h3>
                  <p className="text-sm text-gray-500 font-medium">NIM Asal: {pendaftar.nim_asal || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 border-l border-gray-100 pl-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total SKS Diakui</p>
                  <div className="flex items-center gap-2">
                    <p className={cn("text-2xl font-bold", isOverLimit ? "text-red-600" : "text-blue-900")}>
                      {totalSksDiakui} SKS
                    </p>
                    {isOverLimit && <Badge variant="danger" className="text-[10px] py-0">OVER LIMIT</Badge>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <Badge variant="info">{pendaftar.status}</Badge>
                </div>
              </div>
            </div>

            {isOverLimit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                <Warning size={20} weight="bold" />
                <p className="text-xs font-bold uppercase tracking-tight">
                  Peringatan: Total SKS diakui ({totalSksDiakui}) melebihi batas maksimal {maxSksPersen}% ({maxSksLimit} SKS). Kurangi pengakuan mata kuliah sebelum menyetujui.
                </p>
              </div>
            )}
          </Card>

          {/* Tabel Konversi */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Table size={20} weight="bold" className="text-blue-900" />
                Matriks Pemetaan Mata Kuliah
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
                    <th className="py-4 px-3">MK Asal (SKS)</th>
                    <th className="py-4 px-3 text-center">Nilai</th>
                    <th className="py-4 px-3 text-center"><ArrowRight size={14} /></th>
                    <th className="py-4 px-3">MK Tujuan UNSIA</th>
                    <th className="py-4 px-3 text-center">SKS Diakui</th>
                    <th className="py-4 px-3">Metode / Skor</th>
                    <th className="py-4 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendaftar.hasil_konversi?.map((item: any) => (
                    <tr key={item.id} className={cn("group hover:bg-gray-50/50 transition-colors", item.is_unmatched && "bg-red-50/30")}>
                      <td className="py-4 px-3">
                        <p className="font-bold text-gray-900">{item.transkrip_asal?.nama_mk_asal}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.transkrip_asal?.sks_asal} SKS</p>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <Badge variant="neutral" className="bg-gray-100">{item.transkrip_asal?.nilai_huruf_asal}</Badge>
                      </td>
                      <td className="py-4 px-3 text-center text-gray-300">
                        <ArrowRight size={14} />
                      </td>
                      <td className="py-4 px-3">
                        {item.id_mk_tujuan ? (
                          <>
                            <p className="font-bold text-blue-900">{item.mk_tujuan?.nama_mk}</p>
                            <p className="text-[10px] text-gray-400 font-medium">KODE: {item.mk_tujuan?.kode_mk}</p>
                          </>
                        ) : (
                          <span className="text-red-500 font-bold italic">Belum Dipetakan</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center font-bold text-gray-900">
                        {item.sks_diakui}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1">
                          <Badge variant={item.metode_pemetaan === 'Fuzzy' ? 'info' : item.metode_pemetaan === 'Sumopod' ? 'ai' : 'warning'} className="w-fit">
                            {item.metode_pemetaan || 'Manual'}
                          </Badge>
                          {item.match_score && (
                            <p className="text-[9px] font-bold text-gray-400">SKOR: {item.match_score}%</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <select 
                          className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onChange={(e) => handleUpdateHasil(item.id, { id_mk_tujuan: e.target.value })}
                          value={item.id_mk_tujuan || ''}
                        >
                          <option value="">Ganti MK...</option>
                          {kurikulum.filter(mk => mk.id_prodi === pendaftar.id_prodi).map(mk => (
                            <option key={mk.id} value={mk.id}>{mk.nama_mk} ({mk.sks} SKS)</option>
                          ))}
                        </select>
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
          <Card className="bg-white border-blue-900/10">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Keputusan Kaprodi</h3>
            <div className="space-y-3">
              {pendaftar.status === 'Approved' ? (
                <Button 
                  className="w-full py-4 bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20"
                  onClick={handleDownloadBa}
                >
                  <FilePdf size={20} weight="bold" /> Unduh Berita Acara
                </Button>
              ) : (
                <>
                  <Button 
                    className="w-full py-4 bg-green text-white hover:bg-green/90 shadow-lg shadow-green/20"
                    onClick={handleApprove}
                    isLoading={isApproving}
                    disabled={pendaftar.status !== 'Pending Kaprodi'}
                  >
                    <CheckCircle size={20} weight="bold" /> Setujui Konversi
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full py-4 border-orange/50 text-orange hover:bg-orange/5"
                    onClick={() => setIsRevisiModalOpen(true)}
                    disabled={pendaftar.status !== 'Pending Kaprodi'}
                  >
                    <Clock size={20} weight="bold" /> Minta Revisi
                  </Button>
                  <Button 
                    variant="danger" 
                    className="w-full py-4"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={pendaftar.status !== 'Pending Kaprodi'}
                  >
                    <XCircle size={20} weight="bold" /> Tolak Permohonan
                  </Button>
                </>
              )}
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-900 mb-4 flex items-center gap-2">
              <Info size={16} weight="bold" /> Panduan Validasi
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">Review mata kuliah yang memiliki skor <b>Fuzzy</b> di bawah 80%.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">Gunakan dropdown pada setiap baris untuk melakukan <b>Override</b> MK tujuan.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                <p className="text-xs text-blue-900/70 leading-relaxed font-medium">SKS diakui secara otomatis mengambil nilai terkecil antara MK asal dan MK tujuan.</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Revisi Modal */}
      <Modal
        isOpen={isRevisiModalOpen}
        onClose={() => setIsRevisiModalOpen(false)}
        title="Minta Revisi Berkas"
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsRevisiModalOpen(false)}>Batal</Button>
            <Button onClick={handleRevisi} isLoading={isRevising} className="bg-orange hover:bg-orange/90">Kirim ke Admin</Button>
          </>
        )}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">Jelaskan bagian mana yang perlu diperbaiki oleh Admin atau Akademik:</p>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-4 focus:ring-orange/10 focus:border-orange min-h-[150px] text-sm"
            placeholder="Contoh: Lampiran transkrip PDF tidak terbaca, silakan upload ulang."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Tolak Permohonan Konversi"
        footer={(
          <>
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>Batal</Button>
            <Button onClick={handleReject} isLoading={isRejecting} variant="danger">Tolak Permanen</Button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-700">
            <Warning size={24} weight="bold" className="shrink-0" />
            <p className="text-xs font-bold leading-relaxed uppercase tracking-tight">Tindakan ini tidak dapat dibatalkan. Mahasiswa akan menerima notifikasi penolakan.</p>
          </div>
          <p className="text-sm text-gray-600 font-medium">Alasan Penolakan:</p>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red/10 focus:border-red min-h-[150px] text-sm"
            placeholder="Contoh: Mahasiswa tidak memenuhi syarat minimum IPK atau SKS asal."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
