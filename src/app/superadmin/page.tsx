"use client";

import React from "react";
import { 
  UsersThree, 
  Buildings, 
  Files, 
  CheckCircle,
  Clock,
  ArrowUpRight
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function SuperadminDashboard() {
  const stats = [
    { label: "Total Pengguna", value: "12", icon: UsersThree, color: "text-blue-900", bg: "bg-blue-50" },
    { label: "Program Studi", value: "6", icon: Buildings, color: "text-yellow", bg: "bg-yellow-bg" },
    { label: "Total Permohonan", value: "154", icon: Files, color: "text-purple", bg: "bg-purple-50" },
    { label: "Selesai Konversi", value: "128", icon: CheckCircle, color: "text-green", bg: "bg-green-50" },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard Superadmin" 
        description="Pantau performa sistem, manajemen pengguna, dan konfigurasi global KonverPro UNSIA."
      >
        <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          Unduh Laporan Global
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
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
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Log Aktivitas Terbaru</h3>
              <Button variant="ghost" className="text-blue-700 text-xs uppercase tracking-widest font-bold">
                Lihat Semua <ArrowUpRight size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Superadmin memperbarui konfigurasi SMTP
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 menit yang lalu • IP: 182.1.22.4</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="h-full bg-blue-900 text-white border-none shadow-blue-900/20">
            <h3 className="text-lg font-bold mb-6">Aksi Cepat</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                Tambah User Baru
              </Button>
              <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                Kelola Kamus Sinonim
              </Button>
              <Button className="w-full justify-start bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold py-4">
                Pengaturan API Sumopod
              </Button>
            </div>
            
            <div className="mt-12 p-5 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-yellow mb-2">Status AI</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sumopod API (GPT-4o)</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-green"></div> Online
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
