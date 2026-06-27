# /security

Audit KonverPro Frontend for security vulnerabilities. Report only — no fixes without approval.

## Scope
Full repo scan unless $ARGUMENTS specifies a path.

## Checklist

### Token & Auth
- Token stored in localStorage (flag as known risk, target: httpOnly cookie migration)
- No token exposed in URL query params or console.log
- useAuthGuard hook used on all protected pages
- Redirect to /login on 401 response (Axios interceptor in lib/api.ts)

### File Access
- No window.open() with raw file URL — must use authenticated blob-fetch
- No file path from API response passed directly to <a href>

### XSS
- No dangerouslySetInnerHTML unless absolutely necessary and sanitized
- User-generated content rendered as text, not HTML

### API Calls
- All calls go through lib/api.ts Axios instance (has Authorization header)
- No hardcoded API base URL in individual components (use the instance)
- No API keys or secrets in frontend code or .env.local committed to repo

### TopNav & JSON
- JSON.parse calls wrapped in try-catch (known past crash point)

## Output format (Bahasa Indonesia)
One line per finding: [TINGGI/SEDANG/RENDAH] [file:line] masalah → rekomendasi.
End with: ringkasan temuan per tingkat risiko.

Do NOT apply fixes. Wait for approval.
