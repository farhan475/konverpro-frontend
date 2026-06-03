'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SquaresFour, 
  Buildings, 
  UsersThree, 
  CreditCard, 
  Gear,
  Bell, 
  SignOut, 
  X,
  ShieldCheck,
  Note,
  Envelope
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthorized = useAuthGuard(['superadmin']);

  const navItems = [
    { label: 'DASHBOARD', href: '/superadmin', icon: SquaresFour },
    { label: 'DAFTAR MITRA', href: '/superadmin/mitra', icon: Buildings },
    { label: 'TRANSAKSI', href: '/superadmin/transaksi', icon: CreditCard },
    { label: 'NOTIFIKASI', href: '/superadmin/notifikasi', icon: Envelope },
    { label: 'LOG SISTEM', href: '/superadmin/audit', icon: Note },
    { label: 'KONFIGURASI', href: '/superadmin/pengaturan', icon: Gear },
  ];

  const handleLogout = () => {
    localStorage.removeItem('konverpro_user');
    router.push('/');
  };

  if (!isAuthorized) {
    return (
        <div className="h-screen flex flex-col p-8 space-y-4 bg-black">
            <Skeleton className="h-16 w-full rounded-2xl bg-white/5" />
            <div className="flex-1 flex gap-4">
                <Skeleton className="w-64 h-full rounded-2xl bg-white/5" />
                <Skeleton className="flex-1 h-full rounded-2xl bg-white/5" />
            </div>
        </div>
    );
  }

  return (
    <div className="font-sans text-slate-600 bg-slate-50 min-h-screen overflow-x-hidden text-rendering-optimizeLegibility pb-20 lg:pb-0">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white border-b border-white/10 shadow-2xl">
        <div className="w-full px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/superadmin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0">
                <ShieldCheck size={24} weight="bold" className="text-black" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-tight leading-none uppercase italic">KonverPro <span className="text-yellow-400">Core</span></h1>
              <p className="text-[9px] font-black text-white/40 tracking-[0.2em] mt-1 uppercase">Central Command</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    isActive 
                      ? "bg-white text-black shadow-lg" 
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon size={16} weight={isActive ? "bold" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest leading-none">ROOT ACCESS</p>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-tight mt-1">Superadmin Mode</p>
            </div>

            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition shadow-lg active:scale-95"
            >
                <SignOut size={20} weight="bold" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
        
        <footer className="mt-20 py-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <span>&copy; 2026 KonverPro Infrastructure</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white rounded-full border border-slate-200 tracking-tighter">Cluster: production-ap-southeast-1</span>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-black/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-50 text-white">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all",
                isActive ? "text-yellow-400" : "text-white/40"
              )}
            >
              <item.icon size={22} weight={isActive ? "bold" : "regular"} />
              <span className="text-[7px] font-black uppercase tracking-tighter">{item.label.split(' ')[1] || item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
