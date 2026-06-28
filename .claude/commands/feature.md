# /feature

Plan and implement a new page or component for KonverPro Frontend.

## Usage
/feature <description>

Example: /feature "halaman laporan kaprodi dengan filter bulan"
Example: /feature "komponen tabel kurikulum dengan inline edit"

## Process (STOP at each gate)

### Step 1 — Analyze
Read CLAUDE.md. Identify:
- Which page(s) or component(s) to create or modify
- Which API endpoint(s) to call (from konverpro-api contract)
- State management needed (useState is enough? or context?)
- Mobile behavior (bottom nav, responsive grid)

### Step 2 — Present plan
Show:
- Files to create (new)
- Files to modify (existing)
- Component tree (short, not deep nesting)
- API calls: endpoint, method, what data is expected
- Design decisions: which UI components to use (Button, Table, Badge, etc.)

**STOP. Wait for "ok lanjut" or "approve" before writing any code.**

### Step 3 — Implement
Follow CLAUDE.md design system strictly:
- Colors: only from CSS variables defined in globals.css
- Rounded: rounded-2xl for cards, rounded-[10px] for buttons/inputs
- No font-black
- File download: use blob-fetch helper from lib/api.ts
- Empty state: EmptyState component
- Loading: Skeleton component

### Step 4 — Report (Bahasa Indonesia)
- File dibuat
- File dimodifikasi
- Komponen yang digunakan
- Hal yang sengaja tidak dibuat (YAGNI)
- Risiko atau catatan penting
