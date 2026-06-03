'use client';

import React, { useState, useEffect } from 'react';
import { 
  Note, 
  Clock, 
  UserCircle, 
  Buildings, 
  MagnifyingGlass, 
  Funnel,
  Spinner,
  ShieldCheck,
  TerminalWindow
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface AuditLog {
    id: number;
    action: string;
    details: string;
    ip_address: string;
    created_at: string;
    user: { nama_lengkap: string; role: string } | null;
    kampus: { nama_kampus: string } | null;
}

export default function AuditSystem() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/audit`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-l-4 border-yellow-400 pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Audit</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">LOG AKTIVITAS SISTEM</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Rekaman jejak digital seluruh tindakan user di dalam platform KonverPro.</p>
      </header>

      <div className="akd-card overflow-hidden border-black/5 shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-md">
                <input type="text" placeholder="Cari aksi, user, atau kampus..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none shadow-sm" />
                <MagnifyingGlass size={16} className="absolute left-4 top-3 text-slate-400" />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                    <Funnel size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-black/10">
                    Export Audit
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="py-4 px-6 uppercase">Waktu & IP</th>
                        <th className="py-4 px-4 uppercase">User & Role</th>
                        <th className="py-4 px-4 uppercase">Institusi</th>
                        <th className="py-4 px-4 uppercase">Aksi & Detail</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                    {logs.map((log) => (
                        <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-6">
                                <p className="font-black text-slate-900 text-xs tracking-tight">{new Date(log.created_at).toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-emerald-500" /> {log.ip_address || 'Internal'}
                                </p>
                            </td>
                            <td className="py-5 px-4">
                                <p className="font-black text-slate-700 uppercase text-xs">{log.user?.nama_lengkap || <span className="text-slate-300 italic">SYSTEM</span>}</p>
                                <p className="text-[10px] font-bold text-blue-500 mt-0.5 uppercase tracking-widest">{log.user?.role || '-'}</p>
                            </td>
                            <td className="py-5 px-4">
                                <p className="text-xs font-black text-slate-600 uppercase tracking-tight">{log.kampus?.nama_kampus || <span className="text-slate-300 italic">CORE</span>}</p>
                            </td>
                            <td className="py-5 px-4">
                                <div className="max-w-md overflow-hidden">
                                    <p className="font-black text-slate-900 uppercase text-xs">{log.action}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 truncate hover:whitespace-normal transition-all" title={log.details}>
                                        {log.details || '-'}
                                    </p>
                                </div>
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
