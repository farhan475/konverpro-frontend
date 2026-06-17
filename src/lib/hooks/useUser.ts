'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import api from '@/lib/api';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem('konverpro_user');
      const token = localStorage.getItem('konverpro_token');

      if (userStr && userStr !== 'undefined' && token) {
        const parsed = JSON.parse(userStr) as User;
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const logout = useCallback(() => {
    // Fire-and-forget API call
    api.post('/api/auth/logout').catch(() => {});
    localStorage.removeItem('konverpro_token');
    localStorage.removeItem('konverpro_user');
    setUser(null);
    window.location.href = '/';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data.success && data.data) {
        localStorage.setItem('konverpro_user', JSON.stringify(data.data));
        setUser(data.data as User);
      }
    } catch {
      // Silent fail — user data stays as-is
    }
  }, []);

  return { user, isLoading, logout, refreshUser };
};
