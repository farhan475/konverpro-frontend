'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  User, 
  FileXls, 
  FilePdf,
  MagicWand, 
  ArrowRight,
  Table,
  Info,
  PencilSimple,
  FloppyDisk,
  X
} from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { downloadBlob } from '@/lib/utils/download';
import { ApiResponse, Pendaftar, Prodi, TranskripAsal } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type EditTranskrip = Pick<TranskripAsal, 'id' | 'nama_mk_asal' | 'sks_asal' | 'nilai_huruf_asal'>;

type EditForm = {
  nama_lengkap: string;
  nim_asal: string;
  email: string;
  no_whatsapp: string;
  asal_kampus: string;
  asal_prodi: string;
  id_prodi: string;
  transkrip: EditTranskrip[];
};
export default function DetailAntreanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [pendaftar, setPendaftar] = useState<Pendaftar | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [prodis, setProdis] = useState<Prodi[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Pendaftar>>(`/api/akademik/antrean/${id}`);
      if (data.success) {
        setPendaftar(data.data);
        setEditForm({
          nama_lengkap: data.data.nama_lengkap,
          nim_asal: data.data.nim_asal || '',
          email: data.data.email || '',
          no_whatsapp: data.data.no_whatsapp || '',
          asal_kampus: data.data.asal_kampus || '',
          asal_prodi: data.data.asal_prodi || '',
          id_prodi: data.data.id_prodi,
          transkrip: data.data.transkrip_asal?.map((t: TranskripAsal) => ({
            id: t.id,
            nama_mk_asal: t.nama_mk_asal,
            sks_asal: t.sks_asal,
            nilai_huruf_asal: t.nilai_huruf_asal,
          })) || [],
        });
      }
    } catch {
      toast.error('Gagal mengambil detail pendaftar');
      router.push('/akademik/antrean');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchProdis = useCallback(async () => {
    try {
      const { data } = await api.get<ApiResponse<Prodi[]>>('/api/referensi/prodi');
      if (data.success) setProdis(data.data);
    } catch {
      console.error('Gagal mengambil data prodi');
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDetail();
      fetchProdis();
    }
  }, [fetchDetail, fetchProdis, id]);

  useEffect(() => {
    if (pendaftar?.status !== 'AI Processing') return;

    const interval = window.setInterval(fetchDetail, 3000);
    return () => window.clearInterval(interval);
  }, [fetchDetail, pendaftar?.status]);

  const handleProsesMatching = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.post(`/api/akademik/antrean/${id}/proses`);
      if (data.success) {
        toast.success('Proses matching AI berhasil dimulai');
        fetchDetail();
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal memulai proses matching');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmToKaprodi = async () => {
    setIsConfirming(true);
    try {
      const { data } = await api.post(`/api/akademik/antrean/${id}/confirm`);
      if (data.success) {
        toast.success('Hasil matching dikonfirmasi dan diteruskan ke Kaprodi.');
        router.push('/akademik/antrean');
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal mengkonfirmasi hasil matching');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put(`/api/akademik/antrean/${id}`, editForm);
      if (data.success) {
        toast.success('Data pendaftar berhasil diperbarui');
        setIsEditing(false);
        fetchDetail();
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal memperbarui data');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTranskripField = (index: number, field: keyof EditTranskrip, value: string | number) => {
    if (!editForm) return;
    const newTranskrip = [...editForm.transkrip];
    newTranskrip[index] = { ...newTranskrip[index], [field]: value };
    setEditForm({ ...editForm, transkrip: newTranskrip });
  };

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Detail...</div>;
  if (!pendaftar || !editForm) return null;

  return (
    <div>
      <PageHeader 
        title="Review Data Pendaftar" 
        description="Periksa kembali data hasil parsing Excel sebelum dikirim ke mesin AI untuk proses pemetaan mata kuliah."
      >
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <X size={18} weight="bold" /> Batal
              </Button>
              <Button onClick={handleSaveEdit} isLoading={isSaving} className="bg-green-600 text-white hover:bg-green-700">
                <FloppyDisk size={18} weight="bold" /> Simpan Perubahan
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => router.back()} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft size={18} weight="bold" /> Kembali
              </Button>
              <Button onClick={() => setIsEditing(true)} className="bg-blue-700 text-white hover:bg-blue-800">
                <PencilSimple size={18} weight="bold" /> Edit Data
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Data Mahasiswa */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User size={20} weight="bold" className="text-blue-900" />
                Profil Mahasiswa
              </h3>
              {isEditing && <Badge variant="warning">Sedang Mengedit</Badge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</p>
                  {isEditing ? (
                    <Input 
                      value={editForm.nama_lengkap} 
                      onChange={(e) => setEditForm({...editForm, nama_lengkap: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{pendaftar.nama_lengkap}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NIM Asal</p>
                  {isEditing ? (
                    <Input 
                      value={editForm.nim_asal} 
                      onChange={(e) => setEditForm({...editForm, nim_asal: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{pendaftar.nim_asal || '-'}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Program Studi Asal</p>
                  {isEditing ? (
                    <Input 
                      value={editForm.asal_prodi} 
                      onChange={(e) => setEditForm({...editForm, asal_prodi: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{pendaftar.asal_prodi || '-'}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Universitas Asal</p>
                  {isEditing ? (
                    <Input 
                      value={editForm.asal_kampus} 
                      onChange={(e) => setEditForm({...editForm, asal_kampus: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-900">{pendaftar.asal_kampus || '-'}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prodi Tujuan (UNSIA)</p>
                  {isEditing ? (
                    <select 
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-700 outline-none transition-all"
                      value={editForm.id_prodi}
                      onChange={(e) => setEditForm({...editForm, id_prodi: e.target.value})}
                    >
                      {prodis.map(p => (
                        <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant="info" className="text-xs">{pendaftar.prodi?.nama_prodi}</Badge>
                  )}
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
                    <th className="pb-4 px-2 text-center w-20">SKS</th>
                    <th className="pb-4 px-2 text-center w-24">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isEditing ? (
                    editForm.transkrip?.map((item: EditTranskrip, i: number) => (
                      <tr key={i}>
                        <td className="py-2 px-2">
                          <Input 
                            value={item.nama_mk_asal} 
                            onChange={(e) => updateTranskripField(i, 'nama_mk_asal', e.target.value)}
                            className="text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input 
                            type="number"
                            value={item.sks_asal} 
                            onChange={(e) => updateTranskripField(i, 'sks_asal', parseInt(e.target.value) || 0)}
                            className="text-sm text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input 
                            value={item.nilai_huruf_asal} 
                            onChange={(e) => updateTranskripField(i, 'nilai_huruf_asal', e.target.value)}
                            className="text-sm text-center"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    pendaftar.transkrip_asal?.map((item: TranskripAsal, i: number) => (
                      <tr key={i}>
                        <td className="py-4 px-2 font-bold text-gray-700">{item.nama_mk_asal}</td>
                        <td className="py-4 px-2 text-center font-medium text-gray-600">{item.sks_asal}</td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded bg-gray-100 text-[11px] font-bold text-gray-600 border border-gray-200">
                            {item.nilai_huruf_asal}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className={cn(
            "text-white border-none shadow-sm transition-all duration-300",
            isEditing ? "bg-gray-400 opacity-50 grayscale" : "bg-blue-900 shadow-blue-900/20"
          )}>
            <h3 className="text-lg font-bold mb-4">Aksi Akademik</h3>

            {pendaftar.status === 'Review Akademik' ? (
              <>
                <p className="text-blue-100/70 text-sm mb-8 leading-relaxed">
                  Hasil matching sudah tersedia. Silakan review tabel di samping, lalu konfirmasi untuk meneruskan ke Kaprodi.
                </p>
                <Button 
                  className="w-full py-4 bg-green text-white hover:bg-green/90 font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-3"
                  onClick={handleConfirmToKaprodi}
                  isLoading={isConfirming}
                  disabled={isEditing}
                >
                  <ArrowRight size={20} weight="bold" />
                  Konfirmasi ke Kaprodi
                </Button>
              </>
            ) : pendaftar.status === 'AI Processing' ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Matching sedang diproses</p>
                <p className="mt-2 text-xs leading-relaxed text-blue-100/70">
                  Halaman ini diperbarui otomatis. Notifikasi akan muncul saat hasil siap direview.
                </p>
              </div>
            ) : (
              <>
                <p className="text-blue-100/70 text-sm mb-8 leading-relaxed">
                  {isEditing 
                    ? "Simpan perubahan terlebih dahulu sebelum memproses matching."
                    : "Jika data parsing di samping sudah benar, silakan klik tombol di bawah untuk memicu proses matching otomatis menggunakan AI."}
                </p>
                <Button 
                  className="w-full py-4 bg-yellow text-blue-900 hover:bg-yellow/90 font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-3"
                  onClick={handleProsesMatching}
                  isLoading={isProcessing}
                  disabled={isEditing || (pendaftar.status !== 'Baru' && pendaftar.status !== 'Revisi')}
                >
                  <MagicWand size={20} weight="bold" />
                  Proses Matching AI
                </Button>
              </>
            )}

            {!isEditing && pendaftar.status !== 'Review Akademik' && (
              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex gap-3">
                  <Info size={20} weight="bold" className="text-yellow shrink-0" />
                  <p className="text-[11px] text-blue-100/60 leading-relaxed italic">
                    Matching dijalankan melalui antrean agar halaman tetap responsif. Hasil akan muncul setelah worker selesai.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Dokumen Pendukung</h4>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start text-xs font-bold bg-white"
                onClick={async () => {
                  try {
                    await downloadBlob(`/api/files/excel/${pendaftar.id}`, `Transkrip_${pendaftar.nama_lengkap}.xlsx`);
                  } catch {
                    toast.error('Gagal mengunduh file Excel');
                  }
                }}
              >
                <FileXls size={18} weight="bold" className="text-green-600" /> Lihat Excel Original
              </Button>
              {pendaftar.file_transkrip_pdf_path && (
                <Button 
                  variant="secondary" 
                  className="w-full justify-start text-xs font-bold bg-white"
                  onClick={async () => {
                    try {
                      await downloadBlob(`/api/files/pdf/${pendaftar.id}`, `Transkrip_${pendaftar.nama_lengkap}.pdf`);
                    } catch {
                      toast.error('Gagal mengunduh file PDF');
                    }
                  }}
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

