'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCircle, X } from '@phosphor-icons/react';
import api from '@/lib/api';
import { ApiResponse, InternalNotification } from '@/lib/types';
import { cn } from '@/lib/utils';

type NotificationResponse = ApiResponse<InternalNotification[]> & {
  unread_count: number;
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InternalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<NotificationResponse>('/api/notifications');
      if (data.success) {
        setItems(data.data);
        setUnreadCount(data.unread_count);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 30_000);

    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);

    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const markRead = async (notification: InternalNotification) => {
    if (!notification.read_at) {
      await api.post(`/api/notifications/${notification.id}/read`);
      setItems((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    }
    setOpen(false);
  };

  const markAllRead = async () => {
    await api.post('/api/notifications/read-all');
    setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
        title="Notifikasi"
        aria-label="Buka notifikasi"
      >
        <Bell size={20} weight="bold" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow px-1 text-[9px] font-bold text-blue-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-16 z-[70] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:w-[380px]">
          <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
            <div>
              <p className="text-sm font-bold">Notifikasi</p>
              <p className="text-[11px] text-gray-400">{unreadCount} belum dibaca</p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex h-9 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-blue-700 hover:bg-blue-50"
                  title="Tandai semua dibaca"
                  aria-label="Tandai semua dibaca"
                >
                  <CheckCircle size={16} /> Semua dibaca
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                title="Tutup notifikasi"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-[min(65vh,520px)] overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">Memuat notifikasi...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">Belum ada notifikasi.</p>
            ) : (
              items.map((notification) => {
                const content = (
                  <div
                    className={cn(
                      'flex gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50',
                      !notification.read_at && 'bg-blue-50/60'
                    )}
                  >
                    <div className={cn(
                      'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      notification.read_at ? 'bg-gray-100 text-gray-400' : 'bg-blue-900 text-white'
                    )}>
                      <Check size={14} weight="bold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{notification.message}</p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {new Date(notification.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );

                return notification.action_url ? (
                  <Link
                    href={notification.action_url}
                    key={notification.id}
                    onClick={() => markRead(notification)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="block w-full"
                    key={notification.id}
                    onClick={() => markRead(notification)}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
