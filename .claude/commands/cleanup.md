# /cleanup

Scan and remove dead code, unused imports, and redundant logic in KonverPro Frontend.

## Usage
/cleanup [path]

## What to find
- Unused imports (TypeScript, React, components)
- Unused state variables
- Dead component props (defined in interface but never passed)
- Commented-out code blocks
- Duplicate inline styles that should use existing Tailwind class
- Hardcoded color values that should use CSS variable

## What NOT to touch
- Do not remove UI components from components/ui/ or components/shared/
- Do not change API call structure
- Do not remove TypeScript type definitions even if unused (may be shared)

## Process (STOP at gate)

### Step 1 — Scan
List every finding. One line each: [file:line] jenis masalah → tindakan.

**STOP. Wait for "ok lanjut" or "approve".**

### Step 2 — Remove
Apply only the approved items.

### Step 3 — Report (Bahasa Indonesia)
- File dimodifikasi
- Baris dihapus (total)
- Technical debt dihapus
