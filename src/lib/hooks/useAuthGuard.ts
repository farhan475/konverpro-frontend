'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export const useAuthGuard = (allowedRoles: string[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check role from session storage or cookie
    const userStr = localStorage.getItem('konverpro_user');
    if (!userStr) {
        toast.error('Sesi berakhir. Silakan login kembali.');
        router.push('/');
        return;
    }

    const user = JSON.parse(userStr);
    const role = user.role;

    if (!allowedRoles.includes(role)) {
        toast.error('Anda tidak memiliki akses ke halaman ini.');
        
        // Redirect to correct dashboard based on real role
        const target = role.replace('_', '-');
        router.push(`/${target}`);
    } else {
        setIsAuthorized(true);
    }
  }, [router, pathname, allowedRoles]);

  return isAuthorized;
};
