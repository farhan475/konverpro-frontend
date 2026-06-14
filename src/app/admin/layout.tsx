'use client';

import React from 'react';
import { 
  SquaresFour, 
  UserPlus, 
  Files, 
  Table
} from '@phosphor-icons/react';
import { TopNav } from '@/components/layout/TopNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = useAuthGuard(['admin']);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: SquaresFour },
    { label: 'Upload', href: '/admin/pendaftar/upload', icon: UserPlus },
    { label: 'Data', href: '/admin/pendaftar', icon: Files },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav role="admin" navItems={navItems} />
      <main className="flex-1 pt-[60px] pb-20 lg:pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
      <BottomNav navItems={navItems} />
    </div>
  );
}
