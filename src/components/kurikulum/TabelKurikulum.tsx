'use client';

import { useState, useEffect } from 'react';

interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  tipe_mk: string;
}

export default function TabelKurikulum() {
  const [data, setData] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kurikulum/mata-kuliah`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus mata kuliah ini?')) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kurikulum/mata-kuliah/${id}`, {
      method: 'DELETE',
    });
    setData(data.filter(mk => mk.id !== id));
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-zinc-50">
            <th className="p-3">Kode</th>
            <th className="p-3">Nama MK</th>
            <th className="p-3">SKS</th>
            <th className="p-3">Sem</th>
            <th className="p-3">Tipe</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map(mk => (
            <tr key={mk.id} className="border-b hover:bg-zinc-50">
              <td className="p-3">{mk.kode_mk}</td>
              <td className="p-3">{mk.nama_mk}</td>
              <td className="p-3">{mk.sks}</td>
              <td className="p-3">{mk.semester}</td>
              <td className="p-3">{mk.tipe_mk}</td>
              <td className="p-3">
                <button onClick={() => handleDelete(mk.id)} className="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
