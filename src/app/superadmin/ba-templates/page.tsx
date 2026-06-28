'use client';

import React, { useState, useEffect } from 'react';
import { FilePdf, CheckCircle } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

type BaTemplate = {
  id: string;
  name: string;
  content_header: string | null;
  content_footer: string | null;
  logo_url: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function BaTemplatesPage() {
  const [templates, setTemplates] = useState<BaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BaTemplate | null>(null);
  const [headerHtml, setHeaderHtml] = useState('');
  const [footerHtml, setFooterHtml] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<BaTemplate[]>>('/api/superadmin/ba-templates');
      if (data.success) setTemplates(data.data);
    } catch {
      toast.error('Gagal memuat template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const startEdit = (tpl: BaTemplate) => {
    setEditing(tpl);
    setHeaderHtml(tpl.content_header || '');
    setFooterHtml(tpl.content_footer || '');
  };

  const saveTemplate = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/api/superadmin/ba-templates/${editing.id}`, {
        content_header: headerHtml,
        content_footer: footerHtml,
      });
      toast.success('Template berita acara diperbarui');
      setEditing(null);
      fetchTemplates();
    } catch {
      toast.error('Gagal menyimpan template');
    } finally {
      setSaving(false);
    }
  };

  const setDefault = async (tpl: BaTemplate) => {
    try {
      await api.post(`/api/superadmin/ba-templates/${tpl.id}/set-default`);
      toast.success('Template default diperbarui');
      fetchTemplates();
    } catch {
      toast.error('Gagal mengubah template default');
    }
  };

  return (
    <div>
      <PageHeader title="Template Berita Acara" description="Kelola template HTML untuk dokumen Berita Acara konversi SKS." />

      {editing ? (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Edit: {editing.name}</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>Batal</Button>
              <Button onClick={saveTemplate} isLoading={saving}>Simpan</Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Tersedia placeholder:
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{NAMA_MHS}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{NIM_ASAL}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{NOMOR_BA}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{TANGGAL_BA}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{TOTAL_SKS_DIAKUI}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{TABLE_DIAKUI}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{TABLE_SEMESTER}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{VERIFICATION_QR}}'}</code>
            <code className="mx-1 text-xs bg-gray-100 px-1 rounded">{'{{NAMA_KAPRODI}}'}</code>
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Halaman 1 (Konten Utama)</label>
              <textarea
                className="w-full h-64 font-mono text-xs p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 outline-none"
                value={headerHtml}
                onChange={(e) => setHeaderHtml(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Halaman 2 (Pengesahan & QR)</label>
              <textarea
                className="w-full h-48 font-mono text-xs p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 outline-none"
                value={footerHtml}
                onChange={(e) => setFooterHtml(e.target.value)}
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <Card><p className="text-center text-gray-400 py-8">Memuat template...</p></Card>
          ) : templates.length === 0 ? (
            <Card><p className="text-center text-gray-400 py-8">Belum ada template.</p></Card>
          ) : (
            templates.map((tpl) => (
              <Card key={tpl.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FilePdf size={18} weight="bold" className="text-red-500" />
                      <h3 className="font-bold">{tpl.name}</h3>
                      {tpl.is_default && <Badge variant="success">Default</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      HTML template | Diperbarui: {new Date(tpl.updated_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!tpl.is_default && (
                      <Button variant="secondary" onClick={() => setDefault(tpl)}>
                        <CheckCircle size={16} /> Jadikan Default
                      </Button>
                    )}
                    <Button onClick={() => startEdit(tpl)}>
                      Edit Template
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
