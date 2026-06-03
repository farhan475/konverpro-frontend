'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Spinner, ShieldCheck } from '@phosphor-icons/react';

interface HasilKonversi {
    id_mk_tujuan: number;
    nama_mk_tujuan: string;
    kode_mk_tujuan: string;
    sks_tujuan: number;
    nama_mk_asal: string;
    nilai_akhir_huruf: string;
    sks_diakui: number;
}

interface DataPrint {
    pendaftar: {
        id: string;
        nama_lengkap: string;
        asal_kampus: string;
        total_sks_diakui: number;
        hash_ba_digital: string;
        created_at: string;
    };
    kampus: {
        nama_kampus: string;
        alamat_resmi: string;
        no_telp: string;
        rektor_pimpinan: string;
        website: string;
    };
    prodi: {
        nama_prodi: string;
        jenjang: string;
    };
    hasil: HasilKonversi[];
}

export default function PrintBeritaAcara() {
  const { id } = useParams();
  const [data, setData] = useState<DataPrint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi/${id}/print-data`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (data && !loading) {
        setTimeout(() => {
            window.print();
        }, 1000);
    }
  }, [data, loading]);

  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner className="animate-spin" size={32} /></div>;
  if (!data) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="bg-white text-black p-0 sm:p-8 md:p-12 font-serif text-[12pt] leading-normal max-w-[210mm] mx-auto min-h-screen print:p-0">
      {/* Header / Kop Surat */}
      <header className="border-b-4 border-double border-black pb-4 mb-8 flex items-center justify-between">
        <div className="flex-1">
            <h1 className="text-xl font-bold uppercase">{data.kampus.nama_kampus}</h1>
            <p className="text-[10pt] italic">{data.kampus.alamat_resmi}</p>
            <p className="text-[9pt]">Telp: {data.kampus.no_telp} | Web: {data.kampus.website}</p>
        </div>
        <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-300 rounded text-center">LOGO</div>
      </header>

      <div className="text-center space-y-2 mb-10">
        <h2 className="text-lg font-bold border-b border-black inline-block px-4">BERITA ACARA HASIL KONVERSI NILAI</h2>
        <p className="text-[10pt] font-bold">NOMOR: {new Date(data.pendaftar.created_at).getFullYear()}/BA-KPV/{data.pendaftar.id}</p>
      </div>

      <p className="mb-6">Pada hari ini, tanggal <span className="font-bold">{new Date(data.pendaftar.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>, telah dilakukan proses validasi konversi nilai mahasiswa pindahan/lanjutan dengan rincian sebagai berikut:</p>

      <div className="grid grid-cols-[150px_10px_1fr] gap-x-2 gap-y-1 mb-8 font-bold">
        <span>Nama Mahasiswa</span><span>:</span><span className="uppercase">{data.pendaftar.nama_lengkap}</span>
        <span>ID Pendaftar</span><span>:</span><span>{data.pendaftar.id}</span>
        <span>Asal Perguruan Tinggi</span><span>:</span><span className="uppercase">{data.pendaftar.asal_kampus}</span>
        <span>Program Studi Tujuan</span><span>:</span><span>{data.prodi.jenjang} - {data.prodi.nama_prodi}</span>
      </div>

      <table className="w-full border-collapse border border-black text-[10pt] mb-8">
        <thead>
            <tr className="bg-slate-50 uppercase text-center font-bold">
                <th className="border border-black p-2 w-10">No</th>
                <th className="border border-black p-2">Mata Kuliah Diakui</th>
                <th className="border border-black p-2 w-20">Kode</th>
                <th className="border border-black p-2 w-12">SKS</th>
                <th className="border border-black p-2 w-12">Nilai</th>
                <th className="border border-black p-2">Mata Kuliah Asal</th>
            </tr>
        </thead>
        <tbody>
            {data.hasil.map((h, i) => (
                <tr key={i}>
                    <td className="border border-black p-1.5 text-center">{i + 1}</td>
                    <td className="border border-black p-1.5 font-bold">{h.nama_mk_tujuan}</td>
                    <td className="border border-black p-1.5 text-center font-mono">{h.kode_mk_tujuan}</td>
                    <td className="border border-black p-1.5 text-center">{h.sks_diakui}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{h.nilai_akhir_huruf}</td>
                    <td className="border border-black p-1.5 italic text-slate-600">{h.nama_mk_asal}</td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr className="font-bold bg-slate-50">
                <td colSpan={3} className="border border-black p-2 text-right">TOTAL SKS DIAKUI</td>
                <td className="border border-black p-2 text-center">{data.pendaftar.total_sks_diakui}</td>
                <td colSpan={2} className="border border-black p-2"></td>
            </tr>
        </tfoot>
      </table>

      <div className="flex justify-between items-start mt-16">
        <div className="space-y-20 text-center">
            <p className="font-bold border-b border-black pb-1">MAHASISWA BERSANGKUTAN</p>
            <p className="uppercase font-bold">{data.pendaftar.nama_lengkap}</p>
        </div>
        <div className="space-y-4 text-center w-64">
            <p className="font-bold">KAMPUS, {new Date(data.pendaftar.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold">Ketua Program Studi,</p>
            <div className="h-24 flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl relative overflow-hidden group">
                <ShieldCheck size={40} className="text-emerald-500 mb-1" weight="fill" />
                <span className="text-[7pt] font-mono text-slate-400 break-all px-4">{data.pendaftar.hash_ba_digital}</span>
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8pt] font-black uppercase text-blue-900">Signed Digitally</span>
                </div>
            </div>
            <p className="uppercase font-black border-t border-black pt-1">{data.kampus.rektor_pimpinan || 'KAPRODI'}</p>
            <p className="text-[8pt] font-bold text-slate-500">ID Digital: {data.pendaftar.hash_ba_digital.split('-').pop()}</p>
        </div>
      </div>

      <footer className="mt-20 pt-8 border-t border-slate-200 text-[8pt] text-slate-400 text-center italic">
        Dokumen ini sah dan diterbitkan secara elektronik oleh Sistem KonverPro. Segala bentuk manipulasi data pada dokumen ini dapat ditelusuri melalui sistem audit internal.
      </footer>
    </div>
  );
}
