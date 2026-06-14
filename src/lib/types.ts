export type Role = 'superadmin' | 'admin' | 'akademik' | 'kaprodi';

export type StatusPendaftar = 
  | 'Baru' 
  | 'AI Processing' 
  | 'Pending Kaprodi' 
  | 'Revisi' 
  | 'Approved' 
  | 'Rejected';

export interface User {
  id: string;
  nama_lengkap: string;
  email: string;
  role: Role;
  no_whatsapp?: string;
  avatar_path?: string;
  status: 'active' | 'inactive';
}

export interface Prodi {
  id: string;
  id_kaprodi?: string;
  kode_prodi?: string;
  nama_prodi: string;
  jenjang: 'D3' | 'D4' | 'S1' | 'S2';
}

export interface TranskripAsal {
  id: string;
  id_pendaftar: string;
  nama_mk_asal: string;
  sks_asal: number;
  nilai_huruf_asal: string;
  nilai_angka_asal?: number;
}

export interface HasilKonversi {
  id: string;
  id_pendaftar: string;
  id_mk_tujuan?: string;
  id_transkrip_asal?: string;
  nilai_akhir_huruf?: string;
  sks_diakui: number;
  metode_pemetaan?: 'Fuzzy' | 'Sumopod' | 'Manual Kaprodi';
  match_score?: number;
  match_reason?: string;
  is_unmatched: boolean;
  mk_tujuan?: any; // Simplified for now
  transkrip_asal?: TranskripAsal;
}

export interface Pendaftar {
  id: string;
  id_prodi: string;
  created_by?: string;
  nama_lengkap: string;
  nim_asal?: string;
  email?: string;
  no_whatsapp?: string;
  asal_kampus?: string;
  asal_prodi?: string;
  file_transkrip_excel_path?: string;
  file_transkrip_pdf_path?: string;
  status: StatusPendaftar;
  total_sks_diakui: number;
  catatan_revisi?: string;
  hash_ba_digital?: string;
  notif_sent_at?: string;
  prodi?: Prodi;
  transkrip_asal?: TranskripAsal[];
  hasil_konversi?: HasilKonversi[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}
