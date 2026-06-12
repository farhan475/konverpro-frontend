'use client';

import React from 'react';
import { 
  SquaresFour, 
  UserPlus, 
  Files, 
  Table
} from '@phosphor-icons/react';
import { TopNav } from '@/components/layout/TopNav';
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
    { label: 'Upload Excel', href: '/admin/pendaftar/upload', icon: UserPlus },
    { label: 'Data Pendaftar', href: '/admin/pendaftar', icon: Files },
    { label: 'Template', href: '/admin/template/download', icon: Table },
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
      <TopNav role="admin" navItems={navItems} />
      <main className="pt-24 pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
