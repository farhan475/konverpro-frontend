'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { CourseEquivalency, ApiResponse } from '@/lib/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function EquivalenciesPage() {
  const [rows, setRows] = useState<CourseEquivalency[]>([]);
  const [search, setSearch] = useState('');

  const load = useCallback(
    () => api.get<ApiResponse<CourseEquivalency[]>>('/api/superadmin/equivalencies', { params: { search } })
      .then((response) => setRows(response.data.data))
      .catch(() => toast.error('Gagal memuat ekuivalensi')),
    [search],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (row: CourseEquivalency) => {
    await api.put(`/api/superadmin/equivalencies/${row.id}`, {
      is_active: !row.is_active,
      valid_until: row.valid_until || null,
      alasan: row.alasan || null,
    });
    toast.success('Status ekuivalensi diperbarui');
    load();
  };

  return (
    <div>
      <PageHeader title="Master Ekuivalensi" description="Referensi pemetaan yang terbentuk dari keputusan final Kaprodi dan dapat digunakan kembali oleh proses matching." />
      <Card>
        <label htmlFor="equivalency-search" className="text-sm font-semibold">Cari kampus atau mata kuliah</label>
        <input id="equivalency-search" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field mt-2 max-w-md" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="p-3">Asal</th><th className="p-3">Mata kuliah asal</th><th className="p-3">Ekuivalen UNSIA</th><th className="p-3">Dipakai</th><th className="p-3">Status</th></tr></thead>
            <tbody>{rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-3">{row.asal_kampus}<br /><span className="text-xs text-gray-500">{row.asal_prodi}</span></td>
                <td className="p-3">{row.nama_mk_asal}</td>
                <td className="p-3">{row.mk_tujuan?.nama_mk}<br /><span className="text-xs text-gray-500">{row.sks_diakui} SKS</span></td>
                <td className="p-3">{row.usage_count} kali</td>
                <td className="p-3">
                  <button onClick={() => toggle(row)} className={`min-h-11 px-3 font-semibold ${row.is_active ? 'text-green' : 'text-red'}`}>
                    {row.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
