'use client';

import React from 'react';
import {
  ArrowsLeftRight,
  BookOpen,
  Buildings,
  ChartBar,
  Gear,
  Note,
  SquaresFour,
  UsersThree,
} from '@phosphor-icons/react';
import { TopNav } from '@/components/layout/TopNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useAuthGuard(['superadmin']);

  const navItems = [
    { label: 'Dashboard', href: '/superadmin', icon: SquaresFour },
    { label: 'Users', href: '/superadmin/users', icon: UsersThree },
    { label: 'Prodi', href: '/superadmin/prodi', icon: Buildings },
    { label: 'Sinonim', href: '/superadmin/kamus-sinonim', icon: BookOpen },
    { label: 'Ekuivalensi', href: '/superadmin/equivalencies', icon: ArrowsLeftRight },
    { label: 'Config', href: '/superadmin/config', icon: Gear },
    { label: 'Audit', href: '/superadmin/audit', icon: Note },
    { label: 'Laporan', href: '/superadmin/laporan', icon: ChartBar },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="h-16 bg-blue-900 w-full animate-pulse" />
        <div className="flex-1 p-8">
          <Skeleton className="h-48 w-full rounded-3xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav role="superadmin" navItems={navItems} />
      <main id="main-content" className="flex-1 pt-[60px] pb-20 lg:pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
      <BottomNav navItems={navItems} />
    </div>
  );
}
