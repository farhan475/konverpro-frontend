'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  SignOut, 
  User as UserIcon,
  Bell,
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
  userName?: string;
}

export const TopNav = ({ role, navItems, userName }: TopNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('konverpro_token');
    localStorage.removeItem('konverpro_user');
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-900 text-white border-b border-white/10 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${role}`} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0">
            <ShieldCheck size={24} weight="bold" className="text-blue-900" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-sm tracking-tight leading-none uppercase italic">
              KonverPro <span className="text-yellow">UNSIA</span>
            </h1>
            <p className="text-[9px] font-bold text-white/40 tracking-widest mt-1 uppercase">
              {role === 'superadmin' ? 'Central Command' : `${role} portal`}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  isActive 
                    ? "bg-white text-blue-900 shadow-lg" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon size={16} weight={isActive ? "bold" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-2">
            <p className="text-[10px] font-bold text-yellow uppercase tracking-widest leading-none">
              {userName || 'USER'}
            </p>
            <p className="text-[9px] font-medium text-white/30 uppercase tracking-tight mt-1">
              {role} Mode
            </p>
          </div>

          <button className="w-10 h-10 rounded-xl bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 transition">
            <Bell size={20} weight="bold" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-red text-white flex items-center justify-center hover:bg-red/80 transition shadow-lg active:scale-95"
            title="Keluar"
          >
            <SignOut size={20} weight="bold" />
          </button>
        </div>
      </div>
    </nav>
  );
};
