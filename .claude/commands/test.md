# /test

Generate or run tests for a specific page or component in KonverPro Frontend.

## Usage
/test <component-or-page>

Example: /test StatusBadge
Example: /test "halaman login"
Example: /test DataTable

## Approach (Ponytail-style)
Write the minimum test that fails if the component breaks.
No extensive test suite unless asked.
Prefer behavior tests over implementation tests.

## For each target, verify
- Renders without crash
- KonverPro-specific behavior:
  - StatusBadge: correct color per status string
  - TopNav: no crash if user data is malformed JSON
  - DataTable: shows EmptyState when data is empty array
  - File download button: calls blob-fetch, not window.open()
  - useAuthGuard: redirects to /login if no token

## Output
If tests don't exist yet: generate the test file, show it, ask for approval before writing.
If tests exist: show how to run them.

## Report format (Bahasa Indonesia)
- File test dibuat/dimodifikasi
- Skenario yang dicakup
- Skenario yang sengaja dilewati (YAGNI)
