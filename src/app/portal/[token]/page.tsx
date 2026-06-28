'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DownloadSimple, PaperPlaneTilt } from '@phosphor-icons/react';
import api from '@/lib/api';
import { Appeal, ApiResponse, BaDocument, HasilKonversi } from '@/lib/types';
import { downloadBlob } from '@/lib/utils/download';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

type PortalData = {
  student: { name: string; nim_asal?: string; program: string };
  status: string;
  total_sks_diakui: number;
  catatan_revisi?: string;
  results: HasilKonversi[];
  appeals: Appeal[];
  document?: BaDocument;
};

export default function StudentPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PortalData | null>(null);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    () => api.get<ApiResponse<PortalData>>(`/api/public/portal/${token}`)
      .then((response) => setData(response.data.data))
      .catch(() => toast.error('Tautan portal tidak valid'))
      .finally(() => setLoading(false)),
    [token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post(`/api/public/portal/${token}/appeals`, {
        reason,
        additional_information: details || null,
      });
      toast.success('Permohonan evaluasi ulang dikirim');
      setReason('');
      setDetails('');
      load();
    } catch {
      toast.error('Gagal mengirim permohonan evaluasi ulang. Silakan coba lagi.');
    }
  };

  if (loading) return <main id="main-content" className="p-10 text-center">Memuat portal...</main>;
  if (!data) return <main id="main-content" className="p-10 text-center">Data tidak ditemukan.</main>;

  const canAppeal = ['Approved', 'Rejected'].includes(data.status)
    && !data.appeals.some((appeal) => appeal.status === 'submitted');

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-blue-700">Portal Konversi UNSIA</p>
          <h1 className="text-2xl font-bold">{data.student.name}</h1>
          <p className="text-gray-600">{data.student.program} · Status: {data.status}</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="border bg-white p-4"><p className="text-xs text-gray-500">SKS diakui</p><p className="text-2xl font-bold">{data.total_sks_diakui}</p></div>
          <div className="border bg-white p-4"><p className="text-xs text-gray-500">Mata kuliah diproses</p><p className="text-2xl font-bold">{data.results.length}</p></div>
          <div className="border bg-white p-4"><p className="text-xs text-gray-500">Evaluasi ulang</p><p className="text-2xl font-bold">{data.appeals.length}</p></div>
        </section>

        {data.document?.status === 'final' && (
          <Button onClick={() => downloadBlob(`/api/public/portal/${token}/download-ba`, 'Berita_Acara.pdf')}>
            <DownloadSimple size={18} /> Unduh Berita Acara
          </Button>
        )}

        <section className="border bg-white p-5">
          <h2 className="text-lg font-bold">Hasil konversi</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="p-2">Mata kuliah asal</th><th className="p-2">Tujuan</th><th className="p-2">SKS</th></tr></thead>
              <tbody>{data.results.map((result) => (
                <tr key={result.id} className="border-b">
                  <td className="p-2">{result.transkrip_asal?.nama_mk_asal || '-'}</td>
                  <td className="p-2">{result.mk_tujuan?.nama_mk || 'Belum diakui'}</td>
                  <td className="p-2">{result.sks_diakui}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <section className="border bg-white p-5">
          <h2 className="text-lg font-bold">Riwayat evaluasi ulang</h2>
          <div className="mt-3 space-y-3">{data.appeals.map((appeal) => (
            <div key={appeal.id} className="border p-3 text-sm">
              <p className="font-semibold">{appeal.status}</p>
              <p>{appeal.reason}</p>
              {appeal.resolution_notes && <p className="mt-2 text-gray-600">Keputusan: {appeal.resolution_notes}</p>}
            </div>
          ))}</div>

          {canAppeal && (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="appeal-reason" className="text-sm font-semibold">Alasan evaluasi ulang</label>
                <textarea id="appeal-reason" required minLength={20} value={reason} onChange={(e) => setReason(e.target.value)} className="input-field mt-1 min-h-28" />
              </div>
              <div>
                <label htmlFor="appeal-details" className="text-sm font-semibold">Informasi tambahan</label>
                <textarea id="appeal-details" value={details} onChange={(e) => setDetails(e.target.value)} className="input-field mt-1 min-h-24" />
              </div>
              <Button type="submit"><PaperPlaneTilt size={18} /> Kirim evaluasi ulang</Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
