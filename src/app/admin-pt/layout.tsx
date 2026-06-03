'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SquaresFour, 
  UsersThree, 
  Books, 
  Robot,
  Gear,
  Bell, 
  SignOut, 
  X,
  Buildings,
  CheckFat
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminPtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthorized = useAuthGuard(['admin_pt', 'superadmin']);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'DASHBOARD', href: '/admin-pt', icon: SquaresFour },
    { label: 'MANAJEMEN USER', href: '/admin-pt/users', icon: UsersThree },
    { label: 'MANAJEMEN PRODI', href: '/admin-pt/prodi', icon: Books },
    { label: 'KONTROL AI', href: '/admin-pt/ai', icon: Robot },
    { label: 'PENGATURAN', href: '/admin-pt/pengaturan', icon: Gear },
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
          <Link href="/admin-pt" className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0">
                <Buildings size={22} weight="bold" className="text-[#031f37]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-sm tracking-tight leading-none uppercase italic">KonverPro</h1>
              <p className="text-[10px] font-bold text-blue-200/80 tracking-widest mt-1 uppercase">ADMIN INSTITUSI</p>
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
                      ? "bg-[#FDD824] text-blue-950 shadow-lg" 
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
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{currentTime.toLocaleTimeString('id-ID')}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-tight mt-0.5 tracking-[0.2em]">Live Status</p>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-colors"
              >
                <Bell size={20} weight="bold" className="text-white" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow-lg active:scale-95"
            >
                <SignOut size={20} weight="bold" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-4 lg:px-8 max-w-[1600px] mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
        
        <footer className="mt-20 py-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <span>&copy; 2026 KonverPro</span>
            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
            <span>PT Rajo Net Indonesia</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white rounded-full border border-slate-200">System v2.0 - Institutional Admin</span>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all",
                isActive ? "text-blue-600" : "text-slate-400"
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
