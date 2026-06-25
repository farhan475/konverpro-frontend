'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner, FilePdf } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { downloadPrivateFile } from '@/lib/download';
import { toast } from 'sonner';

export default function PrintBeritaAcara() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(true);

  useEffect(() => {
    const download = async () => {
      try {
        await downloadPrivateFile(`/api/kaprodi/validasi/${id}/download-ba`, `Berita_Acara_${id}.pdf`);
      } catch {
        toast.error('Gagal mengunduh Berita Acara. Pastikan permohonan sudah Approved.');
      } finally {
        setIsDownloading(false);
      }
    };

    if (id) {
      download();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-5">
          {isDownloading ? <Spinner size={28} className="animate-spin" /> : <FilePdf size={28} weight="bold" />}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Berita Acara</h1>
        <p className="text-sm text-gray-500 mb-6">
          {isDownloading ? 'Menyiapkan file PDF...' : 'Proses unduh selesai atau perlu dicoba ulang.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push('/kaprodi/validasi')}>
            Kembali
          </Button>
          <Button
            onClick={async () => {
              setIsDownloading(true);
              try {
                await downloadPrivateFile(`/api/kaprodi/validasi/${id}/download-ba`, `Berita_Acara_${id}.pdf`);
              } finally {
                setIsDownloading(false);
              }
            }}
            isLoading={isDownloading}
          >
            Unduh Ulang
          </Button>
        </div>
      </div>
    </div>
  );
}
