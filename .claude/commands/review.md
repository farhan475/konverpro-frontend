# /review

Review the current diff or the file(s) specified in $ARGUMENTS for correctness AND over-engineering.

## Scope
- If $ARGUMENTS is empty: review the current git diff.
- If $ARGUMENTS has a file or folder path: review only that target.

## Process
1. Read CLAUDE.md for design system and project constraints.
2. Check correctness: broken API calls, missing error handling, type errors, auth bypass.
3. Check design: deviates from KonverPro design system (wrong colors, wrong border-radius, font-black, etc.).
4. Check over-engineering: unnecessary state, reinvented Tailwind utilities, unused components.

## KonverPro-specific design checks
- Uses --blue-900 (#031f37) for primary actions, NOT arbitrary blue shades
- No font-black — use font-bold or font-semibold
- No clock realtime in PageHeader
- No window.open() for file download — must use authenticated blob-fetch
- Token handled via lib/auth.ts, not raw localStorage in components
- TopNav.tsx: no JSON parse without try-catch
- Empty state: uses EmptyState component, not ad-hoc div
- Status badges: uses StatusBadge component with correct color per status

## Output format (Bahasa Indonesia)
**Masalah Kebenaran** — [file:line] masalah → solusi.
**Desain Tidak Konsisten** — [file:line] apa yang salah → seharusnya apa.
**Perlu Disederhanakan** — [file:line] apa yang dibuang → pengganti.

End with: total temuan.
If nothing to fix: "Kode sudah bersih."

Do NOT apply fixes — report only. User approves before implementation.
