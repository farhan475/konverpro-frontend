'use client';

import { useState } from 'react';

export default function ScannerAkademik() {
  const [nama, setNama] = useState('');
  const [asal, setAsal] = useState('');
  const [mkAsal, setMkAsal] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleAutoMatch = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/akademik/scanner/auto-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_prodi: 1, nama_mk_asal: mkAsal }),
    });
    if (res.ok) {
      const data = await res.json();
      setMatchResult(data.match);
    } else {
      setMatchResult(null);
      alert('Tidak ada kecocokan.');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h2 className="font-bold">Scanner Pendaftar</h2>
      <input type="text" placeholder="Nama Pendaftar" className="w-full border p-2" onChange={(e) => setNama(e.target.value)} />
      <input type="text" placeholder="Asal Kampus" className="w-full border p-2" onChange={(e) => setAsal(e.target.value)} />
      <div className="flex gap-2">
        <input type="text" placeholder="MK Asal (untuk di-match)" className="flex-1 border p-2" onChange={(e) => setMkAsal(e.target.value)} />
        <button onClick={handleAutoMatch} className="bg-blue-600 text-white px-4 py-2">Match</button>
      </div>
      
      {matchResult && (
        <div className="bg-green-50 p-4 border border-green-200">
          <p>Cocok dengan MK: <strong>{matchResult.nama_mk}</strong> ({matchResult.sks} SKS)</p>
        </div>
      )}
    </div>
  );
}
