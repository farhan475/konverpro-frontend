# /ponytail-apply

Apply approved Ponytail audit findings to KonverPro Frontend. One finding at a time with approval gate.

## Usage
/ponytail-apply <finding-number|all>

## Hard constraints (never violate)
- Do NOT change routes or page structure without explicit instruction
- Do NOT remove existing UI components (Button, Table, Badge, etc.)
- Do NOT change the design system colors or tokens
- Do NOT touch API call contracts

## Process per finding (STOP at each gate)

### Step 1 — Analyze
Read the finding. Identify every file and line affected.
State exactly what will change.

### Step 2 — Present execution plan
Show a diff-style preview (before/after) for each change.

**STOP. Wait for "ok lanjut" or "approve".**

### Step 3 — Implement
Apply the change. Minimum diff only.

### Step 4 — Report (Bahasa Indonesia)
- File dimodifikasi
- Kode dihapus
- Kode ditambahkan
- Risiko potensial
- Technical debt dihapus / ditambahkan

If running "all": after each finding, ask "Lanjut ke finding berikutnya?" before proceeding.
