"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckSquareOffset, 
  Signature, 
  Clock,
  SealCheck,
  ArrowRight,
  FilePdf
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/api";
import { ApiResponse, Pendaftar, StatusPendaftar } from "@/lib/types";
import { toast } from "sonner";

export default function KaprodiDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<any>>('/api/kaprodi/dashboard');
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

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Dashboard...</div>;

  return (
    <div>
      <PageHeader 
        title="Dashboard Kaprodi" 
        description="Review hasil matching otomatis, lakukan penyesuaian manual, dan berikan persetujuan akhir untuk konversi SKS."
      >
        <Link href="/kaprodi/validasi">
          <Button className="shadow-lg shadow-blue-900/20">
            Mulai Validasi <ArrowRight size={18} weight="bold" />
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Perlu Validasi" 
          value={data?.stats?.pending_validasi || 0} 
          icon={CheckSquareOffset} 
          variant="blue" 
        />
        <StatCard 
          label="Menunggu Revisi" 
          value={data?.stats?.revisi || 0} 
          icon={Clock} 
          variant="orange" 
        />
        <StatCard 
          label="Total Disetujui" 
          value={data?.stats?.approved || 0} 
          icon={SealCheck} 
          variant="green" 
        />
        <StatCard 
          label="Total SKS Diakui" 
          value={data?.stats?.total_sks || 0} 
          icon={FilePdf} 
          variant="red" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Validation Queue */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Antrean Validasi Teratas</h3>
              <Link href="/kaprodi/validasi" className="text-blue-700 text-xs uppercase tracking-widest font-bold hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            <div className="space-y-4">
              {data?.recent_validations?.length === 0 ? (
                <EmptyState 
                  title="Antrean Validasi Kosong" 
                  description="Belum ada permohonan konversi baru yang perlu divalidasi untuk program studi Anda."
                  icon={CheckSquareOffset}
                />
              ) : (
                data?.recent_validations?.map((p: Pendaftar) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-bold text-gray-900">{p.nama_lengkap}</p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded uppercase">
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Asal: {p.asal_kampus || '-'} • {p.asal_prodi || '-'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">SKS Diakui</p>
                          <p className="text-xs font-bold text-gray-600">{p.total_sks_diakui} SKS</p>
                        </div>
                        <Link href={`/kaprodi/validasi/${p.id}`}>
                          <Button variant="primary" className="px-6">Review</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Signature Status */}
        <div className="space-y-6">
          <Card className="bg-white border-blue-900/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                <Signature size={24} weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tanda Tangan Digital</h3>
            </div>
            
            <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm text-gray-400 font-medium mb-4">
                {data?.has_signature 
                  ? "Tanda tangan Anda telah aktif dan akan disematkan pada setiap Berita Acara." 
                  : "Anda belum mengunggah tanda tangan digital."}
              </p>
              <Link href="/kaprodi/tanda-tangan">
                <Button variant="secondary" className="text-xs">Kelola Tanda Tangan</Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-blue-900 text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Informasi Penting</h4>
            <p className="text-sm text-blue-100/70 leading-relaxed mb-4">
              Pastikan Anda memeriksa kembali pemetaan mata kuliah yang memiliki skor matching di bawah 80% atau yang ditandai manual oleh sistem.
            </p>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <p className="text-[11px] font-bold text-yellow uppercase mb-1">Tips:</p>
              <p className="text-[11px] text-blue-100 font-medium italic">"Gunakan fitur override untuk menyesuaikan SKS yang diakui secara manual."</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
