export type Role = 'superadmin' | 'admin' | 'akademik' | 'kaprodi';

export type StatusPendaftar = 
  | 'Baru' 
  | 'AI Processing' 
  | 'Review Akademik'
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
  kurikulum_mk?: KurikulumMk[];
  pengaturan?: {
    max_konversi_sks_persen?: number;
  };
}

export interface InternalNotification {
  id: string;
  id_user: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  subject_type?: string;
  subject_id?: string;
  read_at?: string;
  created_at: string;
}

export interface KamusSinonim {
  id: string;
  kata_utama: string;
  sinonim: string;
  keterangan?: string;
  is_active: boolean;
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
  metode_pemetaan?: 'Referensi' | 'Fuzzy' | 'Sumopod' | 'Manual Kaprodi';
  match_score?: number;
  match_reason?: string;
  is_unmatched: boolean;
  mk_tujuan?: KurikulumMk;
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
  ba_wa_sent_at?: string;
  current_ba_document?: BaDocument;
  appeals?: Appeal[];
  prodi?: Prodi;
  transkrip_asal?: TranskripAsal[];
  hasil_konversi?: HasilKonversi[];
  created_at?: string;
  updated_at?: string;
}


export interface KurikulumMk {
  id: string;
  id_prodi: string;
  kode_mk?: string;
  nama_mk: string;
  deskripsi_singkat?: string;
  sks: number;
  semester: number;
  tipe_mk: 'Wajib' | 'Pilihan';
  is_locked: boolean;
}

export interface BaDocument {
  id: string;
  version: number;
  document_number: string;
  document_hash: string;
  status: 'final' | 'revoked' | 'replaced';
  approved_at: string;
  revoked_reason?: string;
  replaced_by_id?: string;
}

export interface Appeal {
  id: string;
  id_pendaftar: string;
  reason: string;
  additional_information?: string;
  status: 'submitted' | 'accepted' | 'rejected';
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
  pendaftar?: Pendaftar;
}

export interface CourseEquivalency {
  id: string;
  asal_kampus: string;
  asal_prodi?: string;
  nama_mk_asal: string;
  sks_diakui: number;
  alasan?: string;
  valid_from: string;
  valid_until?: string;
  usage_count: number;
  is_active: boolean;
  mk_tujuan?: KurikulumMk & { prodi?: Prodi };
}

export interface StatusSummary {
  status: StatusPendaftar;
  total: number;
}

export interface ProdiReportRow {
  nama_prodi: string;
  total_mhs: number;
  approved: number;
  total_sks: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}

export interface SuperadminLaporan {
  global: {
    total_pendaftar: number;
    total_sks_diakui: number;
    avg_sks_per_mhs: number;
  };
  by_status: StatusSummary[];
  by_prodi: ProdiReportRow[];
  monthly_trends: MonthlyTrend[];
}

export interface KaprodiLaporan {
  summary: StatusSummary[];
  total_sks: number;
  total_pendaftar: number;
  recent_approved: Pendaftar[];
}

export interface AdminDashboardData {
  stats: {
    total_input: number;
    pending: number;
    approved: number;
    revisi: number;
  };
  recent_pendaftar: Pendaftar[];
}

export interface AkademikDashboardData {
  stats: {
    antrean_baru: number;
    ai_processing: number;
    review_akademik: number;
    pending_kaprodi: number;
  };
  recent_queue: Pendaftar[];
  ai_performance: {
    fuzzy_accuracy: number;
    ai_accuracy: number;
    fuzzy_total: number;
    ai_total: number;
    fuzzy_threshold: number;
    ai_threshold: number;
  };
}

export interface KaprodiDashboardData {
  stats: {
    pending_validation: number;
    revisi: number;
    approved: number;
    total_sks: number;
  };
  prodi: Prodi[];
  recent_validation: Pendaftar[];
  verification_method: 'qr';
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
