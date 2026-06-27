'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Role } from '@/lib/types';

export const useAuthGuard = (allowedRoles: Role[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const toastShown = useRef(false);

  // Memoize allowedRoles check to avoid unnecessary re-renders
  const rolesString = JSON.stringify(allowedRoles);

  useEffect(() => {
    const userStr = localStorage.getItem('konverpro_user');

    if (!userStr || userStr === 'undefined') {
      if (pathname !== '/' && !toastShown.current) {
        toast.error('Sesi berakhir. Silakan login kembali.');
        toastShown.current = true;
        router.push('/');
      }
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      if (!user || !user.role) {
        throw new Error('Invalid user data');
      }

      const role = user.role as Role;

      if (!allowedRoles.includes(role)) {
        if (!toastShown.current) {
          toast.error('Anda tidak memiliki akses ke halaman ini.');
          toastShown.current = true;
        }
        
        // Use a small delay to avoid redirect loops during render
        const timeout = setTimeout(() => {
          const target = role.replace('_', '-');
          router.push(`/${target}`);
        }, 100);
        
        return () => clearTimeout(timeout);
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Auth Guard Error:', error);
      localStorage.removeItem('konverpro_user');
      if (pathname !== '/' && !toastShown.current) {
        toast.error('Terjadi kesalahan sesi. Silakan login kembali.');
        toastShown.current = true;
        router.push('/');
      }
    }
  }, [router, pathname, rolesString]);

  return isAuthorized;
};
