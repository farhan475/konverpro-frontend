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
  status: StatusPendaftar;
  total_sks_diakui: number;
  prodi?: Prodi;
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
