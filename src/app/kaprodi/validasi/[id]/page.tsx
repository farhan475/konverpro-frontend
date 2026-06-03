'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Signature, 
  Eraser,
  Info,
  Buildings,
  GraduationCap,
  Stack,
  Certificate,
  FilePdf,
  Spinner,
  DownloadSimple
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

interface TranskripAsal {
  id: number;
  nama_mk_asal: string;
  sks_asal: number;
  nilai_huruf_asal: string;
}

interface KurikulumTarget {
  id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
}

interface HasilKonversi {
  id_mk_tujuan: number;
  id_transkrip_asal: number | null;
  nilai_akhir_huruf: string;
  sks_diakui: number;
}

interface Pendaftar {
  id: string;
  nama_lengkap: string;
  asal_kampus: string;
  status: string;
  transkrip_asal: TranskripAsal[];
  kurikulum_target: KurikulumTarget[];
  hasil_konversi: HasilKonversi[];
}

export default function ValidasiWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  const [mhs, setMhs] = useState<Pendaftar | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapping, setMapping] = useState<Record<number, number | null>>({});
  const [grades, setGrades] = useState<Record<number, string>>({});
  const [isSigning, setIsSigning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const data = res.data;
          setMhs(data);
          
          const initialMapping: Record<number, number | null> = {};
          const initialGrades: Record<number, string> = {};
          
          data.kurikulum_target.forEach((tgt: KurikulumTarget) => {
            const hasil = data.hasil_konversi.find((h: HasilKonversi) => h.id_mk_tujuan === tgt.id);
            initialMapping[tgt.id] = hasil ? hasil.id_transkrip_asal : null;
            initialGrades[tgt.id] = hasil ? hasil.nilai_akhir_huruf : (hasil?.id_transkrip_asal ? "A" : "");
          });
          
          setMapping(initialMapping);
          setGrades(initialGrades);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleMappingChange = (targetId: number, sourceIdStr: string) => {
    const sourceId = sourceIdStr === "" ? null : parseInt(sourceIdStr);
    setMapping(prev => ({ ...prev, [targetId]: sourceId }));
    
    if (sourceId && !grades[targetId]) {
      setGrades(prev => ({ ...prev, [targetId]: 'A' }));
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#031f37';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleApprove = async () => {
    const payload = {
      mapping: Object.entries(mapping)
        .filter(([_, val]) => val !== null)
        .map(([tgtId, srcId]) => ({
          id_mk_tujuan: parseInt(tgtId),
          id_transkrip_asal: srcId,
          nilai_akhir_huruf: grades[parseInt(tgtId)] || 'A'
        })),
      hash_ba_digital: "KPV-HASH-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi/${id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        return json;
    });

    toast.promise(promise, {
        loading: 'Memproses validasi...',
        success: (data) => {
            setIsSigning(false);
            setTimeout(() => window.location.reload(), 1000);
            return 'Validasi berhasil disetujui & Notifikasi dikirim!';
        },
        error: (err) => `Gagal: ${err.message}`
    });
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner className="animate-spin text-blue-600" size={40} /></div>;
  if (!mhs) return <div className="p-10 text-center font-black uppercase text-rose-500">Pendaftar Tidak Ditemukan</div>;

  return (
    <div className="space-y-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="border-l-4 border-[#FDD824] pl-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decision Workspace</p>
                <h1 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">VALIDASI KONVERSI</h1>
                <p className="mt-2 text-sm text-slate-500 font-medium">Memproses validasi kurikulum untuk <span className="text-[#094E8B] font-black uppercase">{mhs.nama_lengkap}</span></p>
            </div>

            <div className="flex flex-wrap gap-3">
                {mhs.status === 'Approved' ? (
                    <>
                        <Link 
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi/${id}/download-pdf`} 
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-950/20 transition hover:bg-black active:scale-95"
                        >
                            <DownloadSimple size={20} weight="bold" className="text-yellow-400" />
                            Download PDF Asli
                        </Link>
                        <Link 
                            href={`/kaprodi/validasi/${id}/print`} 
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition active:scale-95"
                        >
                            <FilePdf size={20} weight="bold" />
                            High-Fidelity Print
                        </Link>
                    </>
                ) : (
                    <>
                        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition active:scale-95">
                            <XCircle size={20} weight="bold" className="text-rose-500" />
                            Tolak / Revisi
                        </button>
                        <button 
                            onClick={() => setIsSigning(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#031f37] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-950/20 transition hover:bg-black active:scale-95"
                        >
                            <CheckCircle size={20} weight="bold" className="text-[#FDD824]" />
                            Finalisasi Validasi
                        </button>
                    </>
                )}
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="akd-card p-6 bg-[#031f37] text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                <GraduationCap size={32} weight="bold" className="text-yellow-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-lg leading-tight">{mhs.nama_lengkap}</h3>
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">ID: {mhs.id}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Kampus Asal</p>
                <p className="text-sm font-bold uppercase">{mhs.asal_kampus}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Status Validasi</p>
                <span className="inline-block px-2 py-0.5 bg-yellow-400 text-blue-950 rounded text-[9px] font-black uppercase">{mhs.status}</span>
              </div>
            </div>
          </div>

          <div className="akd-card p-6 border-dashed border-2 border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={16} weight="bold" className="text-blue-500" /> Instruksi Validasi
            </h4>
            <ul className="space-y-3">
              {[
                "Pilih mata kuliah asal yang sesuai dengan mata kuliah target.",
                "Sesuaikan nilai akhir jika diperlukan berdasarkan aturan prodi.",
                "Mata kuliah yang tidak dipetakan akan dianggap tidak diakui.",
                "Tanda tangan digital diperlukan untuk finalisasi."
              ].map((text, i) => (
                <li key={i} className="flex gap-2 text-xs font-medium text-slate-500 leading-relaxed">
                  <span className="text-blue-500 font-black">•</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mapping Workspace */}
        <div className="lg:col-span-2 akd-card p-0 overflow-hidden shadow-xl">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Stack size={22} weight="bold" />
               </div>
               <h3 className="font-heading text-lg font-black text-[#031f37] uppercase tracking-tight">Pemetaan Mata Kuliah</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-black text-[#031f37]">
                {Object.values(mapping).filter(v => v !== null).length} / {mhs.kurikulum_target.length} MK
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
            {mhs.kurikulum_target.map((tgt) => {
              const mappedId = mapping[tgt.id];
              const isMapped = mappedId !== null;

              return (
                <div key={tgt.id} className={cn(
                  "p-5 rounded-3xl border transition-all duration-300",
                  isMapped ? "bg-white border-blue-200 shadow-md scale-[1.01]" : "bg-slate-50 border-slate-100 opacity-80"
                )}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Certificate weight="bold" className="text-blue-500" /> Mata Kuliah Tujuan ({tgt.sks} SKS)
                      </p>
                      <h4 className="text-sm font-black text-[#031f37] uppercase leading-tight">{tgt.nama_mk}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">Kode: {tgt.kode_mk || 'N/A'} • Sem {tgt.semester}</p>
                    </div>
                    
                    <div className="md:w-1/2 flex items-center">
                        <div className="w-full h-px bg-slate-200 hidden md:block mr-4"></div>
                        <div className="w-full relative">
                          <select 
                            value={mappedId || ""}
                            onChange={(e) => handleMappingChange(tgt.id, e.target.value)}
                            disabled={mhs.status === 'Approved'}
                            className={cn(
                              "w-full text-xs p-3 border rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all font-bold",
                              isMapped ? "bg-white border-blue-200 text-[#094E8B]" : "bg-slate-50 border-slate-200 text-slate-500"
                            )}
                          >
                            <option value="">-- Belum Dipetakan (Kosong) --</option>
                            {mhs.transkrip_asal.map(src => (
                              <option key={src.id} value={src.id}>{src.nama_mk_asal} ({src.nilai_huruf_asal})</option>
                            ))}
                          </select>
                        </div>
                    </div>
                  </div>

                  {isMapped && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finalisasi Nilai Pengakuan:</span>
                      <select 
                        value={grades[tgt.id] || ""}
                        onChange={(e) => setGrades(prev => ({ ...prev, [tgt.id]: e.target.value }))}
                        disabled={mhs.status === 'Approved'}
                        className="text-xs font-black text-[#094E8B] bg-blue-50 border border-blue-200 outline-none rounded-lg px-2 py-1 cursor-pointer"
                      >
                        {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'E'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {isSigning && (
        <div className="fixed inset-0 z-[200] bg-[#031f37]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-white/10 p-10 text-center">
            <div className="w-20 h-20 bg-blue-50 text-[#094E8B] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
              <Signature size={40} weight="bold" />
            </div>
            <h3 className="text-2xl font-heading font-black text-[#031f37] mb-2 uppercase tracking-tight">Tanda Tangan Digital</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Persetujuan ini bersifat permanen. Berita Acara Resmi akan diterbitkan dengan e-Signature Anda.</p>
            
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-300 mb-6 h-56 flex items-center justify-center relative touch-none group hover:border-blue-400 transition-colors">
              <canvas 
                ref={canvasRef}
                width={400}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full cursor-crosshair relative z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                Coret Tanda Tangan Anda
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <button onClick={clearSignature} className="text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                <Eraser size={16} /> Bersihkan
              </button>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-100 px-3 py-1 rounded-full">Secure Digital Hash Verified</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsSigning(false)} className="py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 font-black uppercase text-xs tracking-widest hover:bg-slate-50">Batal</button>
              <button onClick={handleApprove} className="py-4 rounded-2xl bg-[#094E8B] text-white font-black uppercase text-xs tracking-widest hover:bg-black shadow-xl shadow-blue-900/30 flex justify-center items-center gap-2">
                <CheckCircle size={18} weight="bold" /> Final Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
