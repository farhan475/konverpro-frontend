# KonverPro Frontend — Agent Context

## Project
Academic credit transfer system (konversi kredit) for Universitas Siber Asia (UNSIA).
Stack: Next.js 16, TypeScript, Tailwind CSS, Axios.

## Repo structure
```
src/
  app/
    login/
    superadmin/   layout + dashboard, users, prodi, kamus-sinonim, config, audit, laporan
    admin/        layout + dashboard, pendaftar, pendaftar/upload
    akademik/     layout + dashboard, antrean, antrean/[id], kurikulum, kamus-sinonim
    kaprodi/      layout + dashboard, validasi, validasi/[id], validasi/[id]/print,
                  laporan, tanda-tangan
  components/
    ui/           Button, Input, Badge, Card, Table, Modal, Skeleton, Spinner
    layout/       TopNav, BottomNav, PageHeader
    shared/       StatusBadge, StatCard, DataTable, EmptyState, ConfirmDialog
  lib/
    api.ts        Axios instance + interceptor
    auth.ts       getUser, getToken, logout
    hooks/        useAuthGuard, useUser
    types.ts
```

## Design system (enforce strictly)
Colors: --blue-900 (#031f37) primary, --yellow (#FDD824) accent, --white cards, --gray-50 page bg
Font: Geist Sans
Card: rounded-2xl, border border-gray-200, shadow-sm
Button primary: bg-[#031f37] text-white rounded-[10px] font-semibold
NO: heavy shadows, dramatic gradients, large border-radius beyond card, font-black, ALL CAPS except labels/badges, clock realtime in hero
Status badges: Approved=green, Rejected=red, Revisi=orange, Pending Kaprodi=blue pulse, AI Processing=purple pulse, Baru=gray

## Auth
Token: localStorage (current) → httpOnly cookie (target migration via Next.js middleware).
Axios instance in lib/api.ts must send Authorization: Bearer <token> on every request.
No CSRF dance needed (Sanctum Bearer Token).

## API contract
Base: /api — all endpoints from konverpro-api.
Never call file paths directly — always use authenticated API endpoints.

## Key rules
- TopNav.tsx: guard against JSON parse crash
- File download/preview: authenticated blob-fetch helper, never window.open() raw
- No multi-tenancy UI, no billing, no landing page
- Mobile: bottom nav; Desktop: top nav
- Pages must handle empty state (EmptyState component)
- Use DataTable for all list pages with pagination

## Active branch: dev
