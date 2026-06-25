'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';

type Verification = {
  document_number: string;
  version: number;
  status: 'final' | 'revoked' | 'replaced';
  approved_at: string;
  program: string;
  approver: string;
  verification_statement: string;
  revoked_reason?: string;
  replaced_by_id?: string;
};

export default function VerifyDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Verification | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<Verification>>(`/api/public/verify/${id}`)
      .then((response) => setData(response.data.data))
      .catch(() => setError(true));
  }, [id]);

  const valid = data?.status === 'final';

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Universitas Siber Asia</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Verifikasi Berita Acara</h1>

        {error && (
          <div role="alert" className="mt-8 flex gap-3 border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle size={24} weight="fill" /> Dokumen tidak ditemukan.
          </div>
        )}

        {!data && !error && <p className="mt-8 text-gray-500">Memeriksa dokumen...</p>}

        {data && (
          <>
            <div className={`mt-8 flex gap-3 border p-4 ${valid ? 'border-green-200 bg-green-50 text-green-800' : 'border-orange-200 bg-orange-50 text-orange-800'}`}>
              {valid ? <CheckCircle size={26} weight="fill" /> : <WarningCircle size={26} weight="fill" />}
              <div>
                <p className="font-bold">{valid ? 'Dokumen valid' : `Dokumen ${data.status}`}</p>
                <p className="mt-1 text-sm">{valid ? data.verification_statement : data.revoked_reason || 'Dokumen ini tidak lagi aktif.'}</p>
              </div>
            </div>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-gray-500">Nomor</dt><dd className="font-semibold">{data.document_number}</dd></div>
              <div><dt className="text-xs text-gray-500">Versi</dt><dd className="font-semibold">{data.version}</dd></div>
              <div><dt className="text-xs text-gray-500">Program studi</dt><dd className="font-semibold">{data.program}</dd></div>
              <div><dt className="text-xs text-gray-500">Disahkan oleh</dt><dd className="font-semibold">{data.approver}</dd></div>
              <div><dt className="text-xs text-gray-500">Tanggal pengesahan</dt><dd className="font-semibold">{new Date(data.approved_at).toLocaleString('id-ID')}</dd></div>
            </dl>
          </>
        )}
      </section>
    </main>
  );
}
