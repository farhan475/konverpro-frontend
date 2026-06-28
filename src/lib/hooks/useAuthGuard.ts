'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Role, User } from '@/lib/types';
import api from '@/lib/api';

export const useAuthGuard = (allowedRoles: Role[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const toastShown = useRef(false);

  // Memoize allowedRoles check to avoid unnecessary re-renders
  const rolesString = JSON.stringify(allowedRoles);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      let user: User | null = null;

      try {
        const { data } = await api.get('/api/auth/me');
        if (data.success && data.data) {
          user = data.data as User;
        }
      } catch {
        user = null;
      }

      if (!isMounted) return;

      if (!user?.role) {
        if (pathname !== '/' && !toastShown.current) {
          toast.error('Sesi berakhir. Silakan login kembali.');
          toastShown.current = true;
          router.push('/');
        }
        return;
      }

      let allowedRoleList: Role[] = [];
      try {
        allowedRoleList = JSON.parse(rolesString) as Role[];
      } catch {
        toast.error('Sesi tidak valid. Silakan login kembali.');
        toastShown.current = true;
        router.push('/');
        return;
      }
      if (!allowedRoleList.includes(user.role)) {
        if (!toastShown.current) {
          toast.error('Anda tidak memiliki akses ke halaman ini.');
          toastShown.current = true;
        }

        router.push(`/${user.role}`);
        return;
      }

      setIsAuthorized(true);
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [router, pathname, rolesString]);

  return isAuthorized;
};
