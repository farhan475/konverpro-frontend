"use client";

import React from "react";
import { 
  ListBullets, 
  Books, 
  Clock,
  MagicWand,
  ArrowRight,
  ChartBar
} from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AkademikDashboard() {
  const stats = [
    { label: "Antrean Baru", value: "12", icon: ListBullets, color: "text-blue-900", bg: "bg-blue-50" },
    { label: "Sedang Diproses AI", value: "3", icon: MagicWand, color: "text-purple", bg: "bg-purple-50" },
    { label: "Total Mata Kuliah", value: "458", icon: Books, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Rata-rata Matching", value: "82%", icon: ChartBar, color: "text-green", bg: "bg-green-50" },
  ];

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
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                      JS
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Jane Smith</p>
                      <p className="text-[11px] text-gray-500">PJJ Sistem Informasi • 32 Mata Kuliah</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                      <p className="text-xs font-bold text-blue-900">Baru</p>
                    </div>
                    <Link href={`/akademik/antrean/${item}`}>
                      <Button variant="secondary" className="px-4 py-2 text-xs">
                        Proses
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
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
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Akurasi Fuzzy</span>
                  <span className="text-xs font-bold">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow w-[85%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Akurasi Sumopod</span>
                  <span className="text-xs font-bold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green w-[92%] rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-[10px] text-blue-100/40 font-medium">
              Data berdasarkan 500+ pemetaan terakhir yang telah disetujui Kaprodi.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
