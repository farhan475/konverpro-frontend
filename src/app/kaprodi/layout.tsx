'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SquaresFour, 
  UsersThree, 
  ListChecks, 
  Books, 
  Gear,
  Bell, 
  SignOut, 
  X,
  CheckFat,
  FileCsv
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function KaprodiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthorized = useAuthGuard(['kaprodi', 'superadmin']);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'DASHBOARD', href: '/kaprodi', icon: SquaresFour },
    { label: 'VALIDASI KONVERSI', href: '/kaprodi/validasi', icon: ListChecks },
    { label: 'DAFTAR MAHASISWA', href: '/kaprodi/mahasiswa', icon: UsersThree },
    { label: 'PEMETAAN MK', href: '/kaprodi/pemetaan', icon: Books },
    { label: 'LAPORAN', href: '/kaprodi/laporan', icon: FileCsv },
    { label: 'PENGATURAN', href: '/kaprodi/pengaturan', icon: Gear },
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
    <div className="font-sans text-slate-600 bg-[#F8FAFC] min-h-screen overflow-x-hidden pb-20 lg:pb-0 text-rendering-optimizeLegibility">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#031f37]/95 backdrop-blur-xl text-white border-b border-white/10 shadow-[0_18px_45px_rgba(3,31,55,0.18)]">
        <div className="w-full px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link href="/kaprodi" className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FDD824] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">
              <span className="text-blue-900 font-black text-xl">K</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-sm tracking-tight leading-none uppercase italic">KonverPro</h1>
              <p className="text-[10px] font-bold text-yellow-400/80 tracking-widest mt-1 uppercase">KAPRODI PORTAL</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    isActive 
                      ? "bg-[#FDD824] text-blue-950 shadow-lg shadow-yellow-500/20" 
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon size={16} weight={isActive ? "bold" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{currentTime.toLocaleTimeString('id-ID')}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-tight mt-0.5">SISTEM AKTIF</p>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-colors active:scale-90"
              >
                <Bell size={22} weight="bold" className="text-white" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FDD824] border-2 border-[#031f37] rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-widest">Notifikasi</h3>
                    <button onClick={() => setIsNotificationsOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                      <X size={16} weight="bold" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                          <CheckFat size={16} weight="bold" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold leading-tight">Selamat Datang di Portal Kaprodi</p>
                          <p className="text-[10px] text-slate-400 mt-1">Sistem siap memproses validasi transkrip hari ini.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-10 w-px bg-white/10 hidden lg:block"></div>

            <button 
              onClick={handleLogout}
              className="group flex items-center gap-3 pl-1 pr-1 py-1 lg:pr-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              <div className="w-9 h-9 rounded-[14px] bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-inner">
                <SignOut size={18} weight="bold" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none">Logout</p>
                <p className="text-[9px] font-bold text-white/30 uppercase mt-1">KELUAR SESI</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen">
        <header className="mb-10 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#094E8B] mb-2">Portal Ketua Program Studi</p>
              <h2 className="font-heading text-3xl font-black text-[#031f37] tracking-tight uppercase">Dashboard Utama</h2>
           </div>
           <div className="hidden md:flex gap-3">
              <div className="flex flex-col items-end px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Database</span>
                <span className="text-xs font-black text-[#031f37] mt-1.5 uppercase leading-none">Live Sync</span>
              </div>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>

        <footer className="mt-20 py-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">K</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">KonverPro Enterprise</p>
              <p className="text-[9px] font-bold text-slate-300 mt-1">© 2026 PT. Inovasi Akademik</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SISTEM ONLINE
          </span>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-50">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 transition-all",
                isActive ? "text-blue-600" : "text-slate-400"
              )}
            >
              <item.icon size={22} weight={isActive ? "bold" : "regular"} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
        <Link
          href="/kaprodi/laporan"
          className={cn(
            "flex flex-col items-center gap-1.5 p-2 transition-all",
            pathname === "/kaprodi/laporan" ? "text-blue-600" : "text-slate-400"
          )}
        >
          <FileCsv size={22} weight={pathname === "/kaprodi/laporan" ? "bold" : "regular"} />
          <span className="text-[8px] font-black uppercase tracking-tighter">LAPORAN</span>
        </Link>
      </div>
    </div>
  );
}
