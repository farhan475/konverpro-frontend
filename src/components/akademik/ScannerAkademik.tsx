'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  CloudArrowUp, 
  DownloadSimple, 
  ClipboardText, 
  FileDashed,
  CheckCircle,
  PaperPlaneRight,
  Spinner
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Prodi {
  id: number;
  nama_prodi: string;
  jenjang: string;
  kurikulum: {
    id: number;
    nama_mk: string;
    sks: number;
    semester: number;
  }[];
}

export default function ScannerAkademik() {
  const [prodiData, setProdiData] = useState<Prodi[]>([]);
  const [selectedProdiId, setSelectedProdiId] = useState<string>('');
  const [nama, setNama] = useState('');
  const [asal, setAsal] = useState('');
  const [email, setEmail] = useState('');
  const [wa, setWa] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/akademik/scanner`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setProdiData(res.data);
        }
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults([]);
    }
  };

  const calculateSimilarity = (source: string, target: string) => {
    const s = source.toLowerCase().replace(/[^a-z0-9]/g, '');
    const t = target.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s === t) return 1.0;
    if (s.includes(t) || t.includes(s)) return 0.8;
    return 0;
  };

  const handleProcess = () => {
    if (!file || !selectedProdiId) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet);

          if (jsonData.length === 0) {
              toast.error('File Excel kosong atau format tidak sesuai.');
              setLoading(false);
              return;
          }

          const prodi = prodiData.find(p => p.id.toString() === selectedProdiId);
          const kurikulum = prodi?.kurikulum || [];

          const scanResults = jsonData.map(row => {
            const mkAsal = row["Nama Mata Kuliah"] || row["Mata Kuliah"] || row["MK"] || "";
            const sksAsal = row["SKS"] || 0;
            const nilaiAsal = row["Nilai"] || "";

            let bestMatch = null;
            let bestScore = 0;

            kurikulum.forEach(mk => {
              const score = calculateSimilarity(mkAsal, mk.nama_mk);
              if (score > bestScore) {
                bestScore = score;
                bestMatch = mk;
              }
            });

            return {
              mk_asal: mkAsal,
              sks_asal: sksAsal,
              nilai_asal: nilaiAsal,
              id_mk_tujuan: bestScore > 0.6 ? bestMatch?.id : null,
              mk_tujuan: bestScore > 0.6 ? bestMatch?.nama_mk : '-',
              sks_tujuan: bestScore > 0.6 ? bestMatch?.sks : 0,
              diakui: bestScore > 0.6
            };
          });

          setResults(scanResults);
          toast.success(`Berhasil membaca ${scanResults.length} mata kuliah.`);
      } catch (err) {
          toast.error('Gagal memproses file Excel.');
      } finally {
          setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = async () => {
    if (!nama || !selectedProdiId) {
        toast.error('Nama Lengkap dan Prodi Tujuan wajib diisi.');
        return;
    }

    setSaving(true);
    const payload = {
      id_prodi: selectedProdiId,
      nama_lengkap: nama,
      asal_kampus: asal,
      email,
      no_whatsapp: wa,
      matches: results.map(r => ({
        mk_asal: r.mk_asal,
        sks_asal: r.sks_asal,
        nilai_asal: r.nilai_asal
      }))
    };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/akademik/scanner/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (json.success) {
          toast.success('Data berhasil disimpan dan diteruskan ke Kaprodi.');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error(json.message || 'Gagal menyimpan data.');
        }
    } catch (err) {
        toast.error('Terjadi kesalahan jaringan.');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-widest border-b border-slate-100 pb-2">1. Data Pendaftar</h3>
          <div className="space-y-4">
            <select 
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProdiId}
              onChange={(e) => setSelectedProdiId(e.target.value)}
            >
              <option value="">-- Pilih Prodi Tujuan --</option>
              {prodiData.map(p => (
                <option key={p.id} value={p.id}>{p.jenjang} - {p.nama_prodi}</option>
              ))}
            </select>
            <input type="text" placeholder="Nama Lengkap" value={nama} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none" onChange={(e) => setNama(e.target.value)} />
            <input type="email" placeholder="Email (Opsional)" value={email} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Kampus Asal" value={asal} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none" onChange={(e) => setAsal(e.target.value)} />
            <input type="text" placeholder="No. WhatsApp" value={wa} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none" onChange={(e) => setWa(e.target.value)} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-900 mb-4 tracking-widest border-b border-slate-100 pb-2">2. Upload Transkrip</h3>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer p-6 flex flex-col items-center justify-center group mb-4"
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
            <CloudArrowUp size={32} className="text-slate-400 group-hover:text-blue-600 transition mb-2" />
            <p className="text-sm font-bold text-slate-700 text-center">
              {file ? file.name : 'Klik Pilih Excel Transkrip'}
            </p>
          </div>
          <button 
            disabled={!file || !selectedProdiId || loading}
            onClick={handleProcess}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-700 transition disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? <Spinner className="animate-spin mx-auto" /> : 'Baca Transkrip'}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <ClipboardText size={20} className="text-blue-600" /> Hasil Baca Transkrip
            </h4>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-[10px] uppercase font-black text-slate-400 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3">MK Asal</th>
                  <th className="px-5 py-3">Nilai</th>
                  <th className="px-5 py-3">Referensi Tujuan</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-16 text-center text-slate-400">
                      <FileDashed size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Belum ada file yang di-scan.</p>
                    </td>
                  </tr>
                ) : (
                  results.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3 font-medium text-slate-700">
                        {res.mk_asal} <span className="text-[10px] text-slate-400">({res.sks_asal} SKS)</span>
                      </td>
                      <td className="px-5 py-3 font-black text-slate-500">{res.nilai_asal}</td>
                      <td className="px-5 py-3">
                        {res.diakui ? (
                          <span className="font-bold text-blue-700">{res.mk_tujuan} <span className="text-[10px] text-blue-500 ml-1">({res.sks_tujuan} SKS)</span></span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {res.diakui ? (
                          <span className="px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-black uppercase border border-green-100">MATCH</span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-slate-100 text-slate-400 text-[10px] font-black uppercase border border-slate-200">NO MATCH</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {results.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-[#031f37] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition flex justify-center items-center gap-2"
              >
                {saving ? <Spinner className="animate-spin" /> : <><PaperPlaneRight size={18} /> Simpan & Teruskan</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
