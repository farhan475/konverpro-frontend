'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import api from '@/lib/api';

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data.success && data.data) {
        setUser(data.data as User);
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

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout').catch(() => {});
    setUser(null);
    window.location.href = '/';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      if (data.success && data.data) {
        setUser(data.data as User);
      }
    } catch {
      // Keep the current user data if a background refresh fails.
    }
  }, []);

  return { user, isLoading, logout, refreshUser };
};
