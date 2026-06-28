'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Appeal, ApiResponse } from '@/lib/types';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function AppealsPage() {
  const [rows, setRows] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const load = () => {
    setIsLoading(true);
    setIsError(false);
    api.get<ApiResponse<Appeal[]>>('/api/akademik/appeals')
      .then((response) => setRows(response.data.data))
      .catch(() => {
        setIsError(true);
        toast.error('Gagal memuat evaluasi ulang');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    void load();
  }, []);

  const resolve = async (appeal: Appeal, decision: 'accepted' | 'rejected') => {
    const notes = prompt(decision === 'accepted' ? 'Catatan tindak lanjut evaluasi ulang:' : 'Alasan penolakan evaluasi ulang:');
    if (!notes) return;
    try {
      await api.put(`/api/akademik/appeals/${appeal.id}`, { decision, resolution_notes: notes });
      toast.success('Keputusan evaluasi ulang disimpan');
    } catch {
      toast.error('Gagal memproses appeal. Silakan coba lagi.');
    }
    load();
  };

  return (
    <div>
      <PageHeader title="Evaluasi Ulang" description="Tinjau permohonan mahasiswa atas hasil konversi yang telah diputuskan." />
      <div className="space-y-4">
        {isLoading && <Card><p className="text-center text-gray-400 py-8">Memuat data...</p></Card>}
        {isError && <Card><p className="text-center text-red-400 py-8">Gagal memuat data. Silakan refresh halaman.</p></Card>}
        {!isLoading && !isError && rows.length === 0 && <Card>Belum ada permohonan evaluasi ulang.</Card>}
        {rows.map((appeal) => (
          <Card key={appeal.id}>
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <p className="font-bold">{appeal.pendaftar?.nama_lengkap}</p>
                <p className="text-sm text-gray-500">{appeal.pendaftar?.prodi?.nama_prodi} · {new Date(appeal.created_at).toLocaleString('id-ID')}</p>
                <p className="mt-3 text-sm">{appeal.reason}</p>
                {appeal.additional_information && <p className="mt-2 text-sm text-gray-600">{appeal.additional_information}</p>}
                {appeal.resolution_notes && <p className="mt-3 border-l-2 border-blue-700 pl-3 text-sm">Keputusan: {appeal.resolution_notes}</p>}
              </div>
              {appeal.status === 'submitted' && (
                <div className="flex shrink-0 gap-2">
                  <Button onClick={() => resolve(appeal, 'accepted')}>Terima</Button>
                  <Button variant="danger" onClick={() => resolve(appeal, 'rejected')}>Tolak</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
