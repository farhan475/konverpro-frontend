'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SignOut, 
  ShieldCheck
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Role } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

interface TopNavProps {
  role: Role;
  navItems: NavItem[];
}

export const TopNav = ({ role, navItems }: TopNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('konverpro_user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('konverpro_user');
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white border-b border-white/10 h-[60px]">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        {/* Kiri: Logo + KonverPro */}
        <Link href={`/${role}`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow flex items-center justify-center shrink-0">
            <ShieldCheck size={20} weight="bold" className="text-blue-900" />
          </div>
          <h1 className="font-bold text-lg tracking-tight uppercase">
            KonverPro
          </h1>
        </Link>

        {/* Desktop Nav Items (Centered absolute or just regular flex) */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  isActive ? "text-yellow" : "text-white/60 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Kanan: User Info + Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[11px] font-bold text-white uppercase tracking-wide leading-none">
              {user?.nama_lengkap || 'Staff'}
            </p>
            <span className="text-[9px] font-bold text-yellow uppercase tracking-widest mt-1">
              {role}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block" />

          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition flex items-center justify-center"
            title="Keluar"
          >
            <SignOut size={20} weight="bold" />
          </button>
        </div>
      </div>
    </nav>
  );
};
