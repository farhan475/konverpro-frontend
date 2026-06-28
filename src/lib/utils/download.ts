import api from '@/lib/api';
import { toast } from 'sonner';

export async function downloadBlob(url: string, filename: string): Promise<void> {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    toast.error('Gagal mengunduh file.');
  }
}
