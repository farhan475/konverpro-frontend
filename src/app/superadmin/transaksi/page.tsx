'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Money, 
  Buildings,
  Spinner,
  ArrowRight,
  Eye,
  MagnifyingGlass,
  Funnel
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Transaksi {
    id: number;
    id_kampus: number;
    jenis_transaksi: string;
    nominal: string;
    bukti_transfer: string | null;
    keterangan: string | null;
    catatan_admin: string | null;
    status: string;
    created_at: string;
    kampus: { nama_kampus: string };
}

export default function RiwayatTransaksi() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/transaksi`);
        const json = await res.json();
        if (json.success) setTransaksi(json.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Setujui transaksi ini? Saldo mitra akan otomatis bertambah.')) return;
    setProcessingId(id);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/transaksi/${id}/approve`, { method: 'POST' });
        const json = await res.json();
        if (json.success) {
            fetchData();
            toast.success('Transaksi disetujui & saldo diperbarui');
        }
    } catch (err) {
        toast.error('Gagal memproses transaksi.');
    } finally {
        setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Alasan penolakan:');
    if (reason === null) return;
    
    setProcessingId(id);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/transaksi/${id}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catatan_admin: reason })
        });
        const json = await res.json();
        if (json.success) {
            fetchData();
            toast.success('Transaksi telah ditolak');
        }
    } catch (err) {
        toast.error('Gagal menolak transaksi.');
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8">
      <header className="border-l-4 border-yellow-400 pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Terminal</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">TRANSAKSI & BILLING</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Validasi pembayaran topup saldo dan monitoring pemakaian kuota oleh mitra.</p>
      </header>

      <div className="akd-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-md">
                <input type="text" placeholder="Cari mitra atau ID transaksi..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                <MagnifyingGlass size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Funnel size={16} /> Filter
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="py-4 px-6 uppercase">ID & Tanggal</th>
                        <th className="py-4 px-4 uppercase">Mitra Kampus</th>
                        <th className="py-4 px-4 uppercase">Jenis</th>
                        <th className="py-4 px-4 uppercase text-right">Nominal</th>
                        <th className="py-4 px-4 uppercase text-center">Status</th>
                        <th className="py-4 px-6 text-right uppercase">Verifikasi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                    {transaksi.map((t) => (
                        <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-6">
                                <p className="font-black text-slate-900 uppercase text-xs tracking-tight">#{t.id.toString().padStart(6, '0')}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">{new Date(t.created_at).toLocaleString()}</p>
                            </td>
                            <td className="py-5 px-4 font-black text-slate-700 uppercase tracking-tight text-xs">
                                {t.kampus.nama_kampus}
                            </td>
                            <td className="py-5 px-4">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                                    t.jenis_transaksi === 'topup' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-100"
                                )}>{t.jenis_transaksi.replace('_', ' ')}</span>
                            </td>
                            <td className="py-5 px-4 text-right">
                                <p className="font-black text-slate-900">Rp {parseInt(t.nominal).toLocaleString('id-ID')}</p>
                            </td>
                            <td className="py-5 px-4 text-center">
                                <div className="flex flex-col items-center">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border",
                                        t.status === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                        t.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        "bg-rose-50 text-rose-600 border-rose-100"
                                    )}>{t.status}</span>
                                    {t.catatan_admin && <p className="text-[8px] text-rose-400 mt-1 uppercase font-bold italic">{t.catatan_admin}</p>}
                                </div>
                            </td>
                            <td className="py-5 px-6 text-right">
                                {t.status === 'pending' ? (
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleApprove(t.id)}
                                            disabled={processingId === t.id}
                                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                                            title="Setujui"
                                        >
                                            {processingId === t.id ? <Spinner className="animate-spin" /> : <CheckCircle size={18} weight="bold" />}
                                        </button>
                                        <button 
                                            onClick={() => handleReject(t.id)}
                                            disabled={processingId === t.id}
                                            className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                                            title="Tolak"
                                        >
                                            {processingId === t.id ? <Spinner className="animate-spin" /> : <XCircle size={18} weight="bold" />}
                                        </button>
                                    </div>
                                ) : (
                                    <button className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:text-black transition-all">
                                        <Eye size={18} weight="bold" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
