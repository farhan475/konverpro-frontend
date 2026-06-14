'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

interface BottomNavProps {
  navItems: NavItem[];
}

export const BottomNav = ({ navItems }: BottomNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-100 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
                isActive ? "text-blue-900" : "text-gray-400"
              )}
            >
              <item.icon size={24} weight={isActive ? "bold" : "regular"} />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-tighter transition-all",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
