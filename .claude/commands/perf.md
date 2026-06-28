# /perf

Audit KonverPro Frontend for performance issues. Report only — no fixes without approval.

## Scope
Full repo scan unless $ARGUMENTS specifies a path.

## Checklist

### Render & State
- Unnecessary re-renders: state updates that trigger full page re-render
- Large objects in useState that should be split
- Missing useMemo/useCallback on expensive computations (only where measurably needed)

### API Calls
- Duplicate calls to the same endpoint within one page lifecycle
- Missing loading state (skeleton shown while data fetches)
- No pagination on list pages that could return large datasets

### Bundle Size
- Unused imports left in files
- Heavy library imported for a task Tailwind or native browser handles
- Dynamic import missing on heavy page components

### Images & Assets
- Images not using Next.js <Image> component
- SVG imported as full React component when used as static <img> is enough

### Table / List
- DataTable rendering large lists without virtualization (flag if list > 100 rows expected)

## Output format (Bahasa Indonesia)
One line per finding: [TINGGI/SEDANG/RENDAH] [file:line] masalah → rekomendasi.
End with: estimasi improvement yang bisa dicapai.

Do NOT apply fixes. Wait for approval.
