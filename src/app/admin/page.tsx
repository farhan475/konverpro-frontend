"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Files, 
  Clock,
  CheckCircle,
  ArrowRight,
  FileXls
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/api";
import { ApiResponse, Pendaftar, StatusPendaftar } from "@/lib/types";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>('/api/admin/dashboard');
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statsList = [
    { label: "Total Input", value: data?.stats?.total_input || 0, icon: UserPlus, color: "text-blue-900", bg: "bg-blue-50" },
    { label: "Sedang Proses", value: data?.stats?.pending || 0, icon: Clock, color: "text-orange", bg: "bg-orange-50" },
    { label: "Telah Disetujui", value: data?.stats?.approved || 0, icon: CheckCircle, color: "text-green", bg: "bg-green-50" },
    { label: "Perlu Revisi", value: data?.stats?.revisi || 0, icon: Files, color: "text-red", bg: "bg-red-50" },
  ];

  const getStatusVariant = (status: StatusPendaftar) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'Revisi': return 'warning';
      case 'AI Processing': return 'ai';
      case 'Pending Kaprodi': return 'info';
      default: return 'neutral';
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Dashboard...</div>;

  return (
    <div>
      <PageHeader 
        title="Dashboard Admin" 
        description="Selamat datang kembali! Silakan unggah data transkrip mahasiswa baru untuk memulai proses konversi."
      >
        <Link href="/admin/pendaftar/upload">
          <Button className="shadow-lg shadow-blue-900/20">
            <FileXls size={20} weight="bold" /> Unggah Data Baru
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsList.map((stat, i) => (
          <Card key={i} className="flex items-center gap-5">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
              <stat.icon size={28} weight="bold" className={stat.color} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Uploads Table */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Input Terakhir Anda</h3>
              <Link href="/admin/pendaftar" className="text-blue-700 text-xs uppercase tracking-widest font-bold hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 px-2">Mahasiswa</th>
                    <th className="pb-3 px-2">Prodi Tujuan</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.recent_pendaftar?.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-gray-400 italic">Belum ada data input.</td></tr>
                  ) : (
                    data?.recent_pendaftar?.map((p: Pendaftar) => (
                      <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <p className="font-bold text-gray-900">{p.nama_lengkap}</p>
                          <p className="text-xs text-gray-400">NIM Asal: {p.nim_asal || '-'}</p>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-gray-600">{p.prodi?.nama_prodi || '-'}</p>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant={getStatusVariant(p.status)}>
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <Link href={`/admin/pendaftar/${p.id}`}>
                            <button className="text-gray-400 hover:text-blue-900 transition-colors">
                              <ArrowRight size={20} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <div className="space-y-6">
          <Card className="bg-yellow-bg border-yellow/20">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Panduan Cepat</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center text-[10px] font-bold text-blue-900 shrink-0">1</div>
                <p className="text-sm text-blue-900/70 font-medium">Unduh template Excel yang telah disediakan.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center text-[10px] font-bold text-blue-900 shrink-0">2</div>
                <p className="text-sm text-blue-900/70 font-medium">Isi data mahasiswa dan transkrip sesuai format.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center text-[10px] font-bold text-blue-900 shrink-0">3</div>
                <p className="text-sm text-blue-900/70 font-medium">Unggah file Excel dan lampirkan PDF asli (opsional).</p>
              </li>
            </ul>
            <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/template/download`} className="mt-8 block">
              <Button variant="secondary" className="w-full border-yellow/50 text-blue-900 hover:bg-yellow/10">
                Unduh Template Excel
              </Button>
            </a>
          </Card>

          <Card className="bg-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Bantuan Teknis</h4>
            <p className="text-sm text-gray-600 mb-4">Jika mengalami kendala saat upload, silakan hubungi tim IT.</p>
            <Button variant="ghost" className="w-full justify-start px-0 text-blue-700 hover:bg-transparent hover:underline">
              Buka Tiket Bantuan
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
