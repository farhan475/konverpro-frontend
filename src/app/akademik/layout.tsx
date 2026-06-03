'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ClipboardText, 
  SquaresFour, 
  ListChecks, 
  Bell, 
  SignOut, 
  X,
  CheckFat
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AkademikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthorized = useAuthGuard(['akademik', 'superadmin']);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'DASHBOARD', href: '/akademik', icon: SquaresFour },
    { label: 'VERIFIKASI TRANSKRIP', href: '/akademik/scanner', icon: ClipboardText },
    { label: 'ANTREAN PENDAFTARAN', href: '/akademik/antrean', icon: ListChecks },
  ];

  const handleLogout = () => {
    localStorage.removeItem('konverpro_user');
    router.push('/');
  };

  if (!isAuthorized) {
    return (
        <div className="h-screen flex flex-col p-8 space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="flex-1 flex gap-4">
                <Skeleton className="w-64 h-full rounded-2xl" />
                <Skeleton className="flex-1 h-full rounded-2xl" />
            </div>
        </div>
    );
  }

  return (
    <div className="font-sans text-slate-600 bg-[#F8FAFC] min-h-screen overflow-x-hidden pb-20 lg:pb-0">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#031f37]/95 backdrop-blur-xl text-white border-b border-white/10 shadow-[0_18px_45px_rgba(3,31,55,0.18)]">
        <div className="w-full px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link href="/akademik" className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white text-[#031f37] flex items-center justify-center shadow-lg">
              <ClipboardText size={24} weight="bold" />
            </div>
            <div className="border-l border-white/20 pl-3">
              <h1 className="font-heading text-base lg:text-xl font-black leading-none tracking-tight">WORKSPACE AKADEMIK</h1>
              <p className="mt-1.5 text-[9px] font-black uppercase tracking-[0.28em] text-blue-100">Origin Verification Desk</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 text-white font-bold text-xs uppercase tracking-wide">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors duration-200 hover:text-[#FDD824] border-b-2 px-1 py-2 whitespace-nowrap",
                  pathname === item.href ? "text-[#FDD824] border-[#FDD824]" : "border-transparent"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Popover */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center hover:bg-white/15 transition"
              >
                <Bell size={20} weight="bold" />
                <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#031f37]">0</span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white text-slate-600 border border-slate-100 shadow-2xl overflow-hidden z-[120]">
                  <div className="bg-[#031f37] text-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#FDD824]">Notification Center</p>
                      <p className="text-sm font-black mt-0.5">TRANSKRIP AKADEMIK</p>
                    </div>
                    <button onClick={() => setIsNotificationsOpen(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15">
                      <X size={16} weight="bold" />
                    </button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto p-3 space-y-2 text-center text-slate-400 py-10">
                    <p className="font-black text-[#031f37]">Belum ada notifikasi.</p>
                    <p className="text-xs mt-1">Aktivitas transkrip akan muncul di sini.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 pl-2 pr-3 py-1.5">
              <div className="w-9 h-9 rounded-full bg-[#FDD824] text-[#031f37] font-black flex items-center justify-center shadow-lg">A</div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">Akademik</p>
                <p className="text-xs font-black text-white max-w-[170px] truncate">Staf Akademik</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow-lg"
            >
              <SignOut size={20} weight="bold" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-[60] flex justify-around px-4 pb-3 pt-2 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-slate-400 text-[9px] font-black uppercase",
              pathname === item.href && "text-[#031f37]"
            )}
          >
            <item.icon size={24} weight="bold" className={cn(pathname === item.href && "text-[#FDD824]")} />
            {item.label.split(' ')[0]}
          </Link>
        ))}
      </div>

      <main className="pt-24 lg:pt-28 px-4 lg:px-8 max-w-[1360px] mx-auto space-y-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#031f37] via-[#094E8B] to-[#031f37] text-white p-5 lg:p-7 shadow-2xl shadow-blue-900/20">
          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-[#FDD824]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-10 bottom-0 w-64 h-64 rounded-full border border-white/15 pointer-events-none"></div>
          
          <div className="absolute right-6 top-6 z-20 hidden lg:flex flex-col items-end gap-2 pointer-events-none">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-400/10 border border-green-300/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-green-200 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="animate-pulse relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              SISTEM AKTIF
            </div>
            <div className="rounded-2xl bg-white/12 border border-white/15 px-4 py-3 text-right backdrop-blur-md">
              <p className="font-mono text-2xl font-black text-white leading-none">
                {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100 mt-1">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-end">
            <div className="lg:pr-72 xl:pr-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FDD824] text-[#031f37] px-4 py-2 text-[9px] font-black uppercase tracking-[0.25em] shadow-lg shadow-yellow-500/20">
                <CheckFat size={14} weight="bold" /> Manual Verification
              </span>
              <h2 className="font-heading text-2xl lg:text-4xl font-black mt-5 leading-tight">
                {pathname === '/akademik' && 'DASHBOARD AKADEMIK'}
                {pathname === '/akademik/scanner' && 'VERIFIKASI TRANSKRIP'}
                {pathname === '/akademik/antrean' && 'ANTREAN PENDAFTARAN'}
              </h2>
              <p className="text-blue-100 text-xs lg:text-base leading-7 mt-3 max-w-3xl">
                Verifikasi mata kuliah, SKS, dan nilai asal dari transkrip yang dikirim Staff sebelum otoritas dokumen diteruskan ke Kaprodi.
              </p>
            </div>
          </div>
        </section>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
        </div>

        <footer className="py-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-100 px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> KONVERPRO v2.0 - Akademik
          </span>
        </footer>
      </main>
    </div>
  );
}
