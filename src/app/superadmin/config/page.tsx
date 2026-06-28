'use client';

import React, { useState, useEffect } from 'react';
import { 
  MagicWand, 
  Envelope, 
  WhatsappLogo, 
  Buildings,
  Lock,
  FloppyDisk
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

export default function ConfigPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Record<string, string>>>('/api/superadmin/config');
      if (data.success) {
        setConfigs(data.data);
      }
    } catch {
      toast.error('Gagal mengambil konfigurasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put('/api/superadmin/config', { settings: configs });
      if (data.success) {
        toast.success('Konfigurasi berhasil disimpan');
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Gagal menyimpan konfigurasi');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      id: 'general',
      title: 'Informasi Institusi',
      icon: Buildings,
      fields: [
        { key: 'nama_institusi', label: 'Nama Institusi', placeholder: 'Universitas Siber Asia' },
      ]
    },
    {
      id: 'ai',
      title: 'Sumopod AI (OpenAI Compatible)',
      icon: MagicWand,
      fields: [
        { key: 'sumopod_api_key', label: 'API Key', placeholder: 'sk-xxxx', type: 'password' },
        { key: 'sumopod_base_url', label: 'Base URL', placeholder: 'https://api.sumopod.com/v1' },
        { key: 'sumopod_model', label: 'Model Name', placeholder: 'gpt-4o-mini' },
        { key: 'fuzzy_threshold_auto', label: 'Threshold Fuzzy Auto (%)', placeholder: '80', type: 'number' },
        { key: 'fuzzy_threshold_sumopod', label: 'Threshold AI Review (%)', placeholder: '50', type: 'number' },
      ]
    },
    {
      id: 'wa',
      title: 'WhatsApp (Fonnte)',
      icon: WhatsappLogo,
      fields: [
        { key: 'fonnte_api_key', label: 'Fonnte API Key', placeholder: 'Your token...', type: 'password' },
        { key: 'notif_wa_aktif', label: 'Aktifkan Notifikasi WA', type: 'select', options: [{v: 'true', l: 'Ya'}, {v: 'false', l: 'Tidak'}] },
      ]
    },
    {
      id: 'smtp',
      title: 'Email (SMTP)',
      icon: Envelope,
      fields: [
        { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtp.gmail.com' },
        { key: 'smtp_port', label: 'SMTP Port', placeholder: '587' },
        { key: 'smtp_username', label: 'SMTP Username', placeholder: 'noreply@unsia.ac.id' },
        { key: 'smtp_password', label: 'SMTP Password', placeholder: '********', type: 'password' },
        { key: 'smtp_from_name', label: 'Sender Name', placeholder: 'KonverPro UNSIA' },
        { key: 'notif_email_aktif', label: 'Aktifkan Notifikasi Email', type: 'select', options: [{v: 'true', l: 'Ya'}, {v: 'false', l: 'Tidak'}] },
      ]
    }
  ];

  if (loading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Memuat Konfigurasi...</div>;

  return (
    <div>
      <PageHeader 
        title="Konfigurasi Global" 
        description="Atur API Key, parameter AI, dan server notifikasi untuk seluruh sistem KonverPro UNSIA."
      >
        <Button onClick={handleSave} isLoading={isSaving} className="shadow-lg shadow-blue-900/20">
          <FloppyDisk size={20} weight="bold" /> Simpan Semua Perubahan
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section) => (
          <Card key={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                <section.icon size={24} weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div key={field.key}>
                  {field.type === 'select' ? (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">{field.label}</label>
                      <select 
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 transition-all"
                        value={configs[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                      >
                        {field.options?.map(opt => (
                          <option key={opt.v} value={opt.v}>{opt.l}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input 
                      label={field.label}
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={configs[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-yellow-bg border border-yellow/20 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-yellow flex items-center justify-center text-blue-900 shrink-0">
          <Lock size={20} weight="bold" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1 uppercase tracking-tight">Catatan Keamanan</h4>
          <p className="text-sm text-blue-900/60 leading-relaxed font-medium">
            Beberapa nilai sensitif (seperti API Key dan Password) dienkripsi di sisi server. Perubahan pada konfigurasi ini akan berdampak langsung pada proses matching dan pengiriman notifikasi di seluruh sistem.
          </p>
        </div>
      </div>
    </div>
  );
}
