'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ImportKurikulum({ id_prodi }: { id_prodi: number }) {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kurikulum/mata-kuliah/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_prodi, excel_data: json }),
        });

        if (!response.ok) throw new Error('Gagal mengimpor data');
        alert('Data berhasil diimpor');
      } catch (err) {
        alert('Terjadi kesalahan: ' + err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileUpload} disabled={loading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      {loading && <p>Mengimpor...</p>}
    </div>
  );
}
