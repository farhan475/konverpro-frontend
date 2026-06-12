'use client';

import React from 'react';
import { 
  SquaresFour, 
  CheckSquareOffset, 
  ChartBar, 
  Signature
} from '@phosphor-icons/react';
import { TopNav } from '@/components/layout/TopNav';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function KaprodiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useAuthGuard(['kaprodi']);

  const navItems = [
    { label: 'Dashboard', href: '/kaprodi', icon: SquaresFour },
    { label: 'Validasi Konversi', href: '/kaprodi/validasi', icon: CheckSquareOffset },
    { label: 'Laporan Prodi', href: '/kaprodi/laporan', icon: ChartBar },
    { label: 'Tanda Tangan', href: '/kaprodi/tanda-tangan', icon: Signature },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="h-16 bg-blue-900 w-full animate-pulse" />
        <div className="flex-1 p-8">
          <Skeleton className="h-48 w-full rounded-3xl mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav role="kaprodi" navItems={navItems} />
      <main className="pt-24 pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
