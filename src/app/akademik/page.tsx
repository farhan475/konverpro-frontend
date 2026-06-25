"use client";

import React, { useState, useEffect } from "react";
import { 
  ListBullets, 
  Clock,
  Eye,
  MagicWand,
  ArrowRight
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import api from "@/lib/api";
import { AkademikDashboardData, ApiResponse, Pendaftar } from "@/lib/types";
import { toast } from "sonner";

export default function AkademikDashboard() {
  const [data, setData] = useState<AkademikDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<AkademikDashboardData>>('/api/akademik/dashboard');
      if (data.success) {
        setData(data.data);
      }
    } catch {
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
        title="Dashboard Akademik" 
        description="Kelola antrean konversi mahasiswa dan pastikan database kurikulum serta kamus sinonim tetap mutakhir."
      >
        <Link href="/akademik/antrean">
          <Button className="shadow-lg shadow-blue-900/20">
            Lihat Antrean <ArrowRight size={18} weight="bold" />
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Antrean Baru" 
          value={data?.stats?.antrean_baru || 0} 
          icon={ListBullets} 
          variant="blue" 
        />
        <StatCard 
          label="AI Processing" 
          value={data?.stats?.ai_processing || 0} 
          icon={MagicWand} 
          variant="purple" 
        />
        <StatCard 
          label="Review Akademik" 
          value={data?.stats?.review_akademik || 0} 
          icon={Eye} 
          variant="yellow" 
        />
        <StatCard 
          label="Pending Kaprodi" 
          value={data?.stats?.pending_kaprodi || 0} 
          icon={Clock} 
          variant="orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Queue */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Antrean Perlu Review</h3>
              <Link href="/akademik/antrean" className="text-blue-700 text-xs uppercase tracking-widest font-bold hover:underline">
                Kelola Semua
              </Link>
            </div>
            
            <div className="space-y-4">
              {data?.recent_queue?.length === 0 ? (
                <EmptyState 
                  title="Antrean Kosong" 
                  description="Tidak ada permohonan konversi baru yang perlu diproses saat ini."
                  icon={ListBullets}
                />
              ) : (
                data?.recent_queue?.map((p: Pendaftar) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                        {p.nama_lengkap.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.nama_lengkap}</p>
                        <p className="text-[11px] text-gray-500">{p.prodi?.nama_prodi || '-'} | NIM: {p.nim_asal || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                        <p className="text-xs font-bold text-blue-900">{p.status}</p>
                      </div>
                      <Link href={`/akademik/antrean/${p.id}`}>
                        <Button variant="secondary" className="px-4 py-2 text-xs">
                          Proses
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* AI Performance Card */}
        <div>
          <Card className="h-full bg-blue-900 text-white border-none">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-yellow">
              <MagicWand size={24} weight="bold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automatisasi AI</h3>
            <p className="text-blue-100/70 text-sm mb-8 leading-relaxed">
              Sistem menggunakan Fuzzy Matching dan Sumopod AI untuk memetakan mata kuliah secara otomatis.
            </p>
            
            {(() => {
              const fuzzyAcc = data?.ai_performance?.fuzzy_accuracy || 0;
              const aiAcc = data?.ai_performance?.ai_accuracy || 0;
              const fuzzyTotal = data?.ai_performance?.fuzzy_total || 0;
              const aiTotal = data?.ai_performance?.ai_total || 0;
              return (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Akurasi Fuzzy</span>
                      <span className="text-xs font-bold">{fuzzyTotal > 0 ? `${fuzzyAcc}%` : 'N/A'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow rounded-full transition-all duration-700" style={{ width: `${fuzzyTotal > 0 ? fuzzyAcc : 0}%` }}></div>
                    </div>
                    <p className="text-[9px] text-blue-100/40 mt-1">{fuzzyTotal} pemetaan | Threshold: {data?.ai_performance?.fuzzy_threshold || 80}%</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Akurasi Sumopod</span>
                      <span className="text-xs font-bold">{aiTotal > 0 ? `${aiAcc}%` : 'N/A'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green rounded-full transition-all duration-700" style={{ width: `${aiTotal > 0 ? aiAcc : 0}%` }}></div>
                    </div>
                    <p className="text-[9px] text-blue-100/40 mt-1">{aiTotal} pemetaan | Threshold: {data?.ai_performance?.ai_threshold || 50}%</p>
                  </div>
                </div>
              );
            })()}

            <p className="mt-8 text-[10px] text-blue-100/40 font-medium">
              Data dihitung real-time dari hasil pemetaan yang sudah diproses.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
