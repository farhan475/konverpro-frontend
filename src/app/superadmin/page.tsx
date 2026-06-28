"use client";

import React, { useState, useEffect } from "react";
import { 
  UsersThree, 
  Buildings, 
  Files, 
  Clock,
  ArrowUpRight,
  ListBullets
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/shared/StatCard";
import api from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";
import { downloadBlob } from "@/lib/utils/download";

type SuperadminDashboardData = {
  stats: {
    total_user: number;
    total_prodi: number;
    total_pendaftar: number;
    total_audit: number;
  };
  recent_audits: Array<{
    id: string;
    action: string;
    details?: string | null;
    ip_address?: string | null;
    created_at: string;
    user?: { nama_lengkap?: string } | null;
  }>;
  ai_status?: {
    configured: boolean;
    model?: string;
  };
  quality?: {
    average_processing_hours: number;
    manual_override_rate: number;
    approved_count: number;
    ba_whatsapp_delivery_rate: number;
    open_appeals: number;
    unmatched_courses: number;
  };
};
export default function SuperadminDashboard() {
  const [data, setData] = useState<SuperadminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<SuperadminDashboardData>>('/api/superadmin/dashboard');
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
        title="Dashboard Superadmin" 
        description="Pantau performa sistem, manajemen pengguna, dan konfigurasi global KonverPro UNSIA."
      >
        <Button
          variant="secondary"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={async () => {
            try {
              await downloadBlob('/api/superadmin/laporan?format=csv', 'laporan_global_konverpro.csv');
            } catch {
              toast.error('Gagal mengunduh laporan global');
            }
          }}
        >
          Unduh Laporan Global
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Pengguna" 
          value={data?.stats?.total_user || 0} 
          icon={UsersThree} 
          variant="blue" 
        />
        <StatCard 
          label="Program Studi" 
          value={data?.stats?.total_prodi || 0} 
          icon={Buildings} 
          variant="yellow" 
        />
        <StatCard 
          label="Total Permohonan" 
          value={data?.stats?.total_pendaftar || 0} 
          icon={Files} 
          variant="purple" 
        />
        <StatCard 
          label="Total Log Audit" 
          value={data?.stats?.total_audit || 0} 
          icon={ListBullets} 
          variant="green" 
        />
      </div>

      <section aria-labelledby="quality-heading" className="mb-8">
        <h2 id="quality-heading" className="mb-4 text-lg font-bold">Kualitas proses</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[
            ['Rata-rata proses', `${data?.quality?.average_processing_hours || 0} jam`],
            ['Override manual', `${data?.quality?.manual_override_rate || 0}%`],
            ['Approved', data?.quality?.approved_count || 0],
            ['BA terkirim WA', `${data?.quality?.ba_whatsapp_delivery_rate || 0}%`],
            ['Banding terbuka', data?.quality?.open_appeals || 0],
            ['Belum dipetakan', data?.quality?.unmatched_courses || 0],
          ].map(([label, value]) => (
            <div key={label} className="border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="mt-1 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Log Aktivitas Terbaru</h3>
              <Link href="/superadmin/audit">
                <Button variant="ghost" className="text-blue-700 text-xs uppercase tracking-widest font-bold">
                  Lihat Semua <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {data?.recent_audits?.length === 0 ? (
                <div className="py-12 text-center text-gray-400 italic">Belum ada aktivitas tercatat.</div>
              ) : (
                data?.recent_audits?.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-900">
                      <Clock size={20} weight="bold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {log.user?.nama_lengkap || 'System'} : <span className="text-blue-700">{log.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.created_at).toLocaleString()} | IP: {log.ip_address || '-'}
                      </p>
                      {log.details && <p className="text-[11px] text-gray-400 mt-1 italic">{log.details}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="h-full bg-blue-900 text-white border-none shadow-blue-900/20">
            <h3 className="text-lg font-bold mb-6">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link href="/superadmin/users" className="block">
                <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                  Tambah User Baru
                </Button>
              </Link>
              <Link href="/superadmin/kamus-sinonim" className="block">
                <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                  Kelola Kamus Sinonim
                </Button>
              </Link>
              <Link href="/superadmin/config" className="block">
                <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                  Pengaturan API Sumopod
                </Button>
              </Link>
              <Link href="/superadmin/ba-templates" className="block">
                <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                  Template Berita Acara
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 p-5 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-yellow mb-2">Status AI</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sumopod AI Service</span>
                {data?.ai_status?.configured ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-green uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green"></div> Terkonfigurasi
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-yellow uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow"></div> Belum Dikonfigurasi
                  </span>
                )}
              </div>
              {data?.ai_status?.configured && (
                <p className="text-[10px] text-white/40 mt-1">Model: {data.ai_status.model}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
