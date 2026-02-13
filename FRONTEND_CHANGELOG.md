# Frontend Changelog

## Summary of Changes

### UI Architecture Overhaul
- Decomposed monolithic `ConverterPanel` into focused components: `ConverterCard`, `ResultCard`, `BaseSelector`, `ShortcutsModal`, and `Toast`.
- Replaced dropdown `<select>` base pickers with a compact **segmented control** (`BaseSelector`) using `role="radiogroup"` for accessibility.
- Moved from a two-column side-by-side layout to a **single centered card** (max-width 576px) that reads naturally on mobile and desktop.
- History and Steps panels are now **collapsible `<details>` elements**, reducing visual clutter on first load.

### Performance & Bundle Size
- **Removed Google Fonts** (Nunito, Space Grotesk) and replaced with a system font stack. This eliminates external network requests and reduces LCP.
- **Lazy-loaded `StepsPanel`** via `React.lazy` + `Suspense` to reduce initial JS payload.
- Vite build configured with `target: 'es2022'`, manual React chunk splitting, and `esbuild` minification.
- `index.html` includes an inline script to apply the saved theme **before first paint**, preventing FOUC.
- Removed unused Tailwind `boxShadow` extension; CSS variables now handle all theming.

### Design System
- Introduced **CSS custom properties** (variables) for all theme tokens: `--color-accent`, `--color-bg`, `--color-surface`, `--color-text`, `--color-border`, etc.
- Both light and dark themes defined via variables in `:root` / `.dark`, making future theme additions straightforward.
- Created reusable CSS component classes: `.btn-primary`, `.btn-secondary`, `.btn-icon`, `.card`, `.card-interactive`, `.input-field`.
- Single accent color (violet) for a clean, professional look.

### Accessibility
- All base selector buttons have `role="radio"` + `aria-checked` + `aria-label`.
- Result updates announced via `aria-live="polite"` + `aria-atomic="true"`.
- Errors use `role="alert"` with `aria-live="polite"`.
- Keyboard shortcuts: `Enter` (convert), `Ctrl/Cmd+K` (focus input), `?` (toggle shortcuts modal), `Esc` (close modal), `Alt+Arrow` (change base).
- `:focus-visible` outlines for keyboard navigation; no outlines for mouse users.
- `ShortcutsModal` traps focus and auto-focuses close button on open.

### Testing & CI
- Added comprehensive test suite: 16+ App integration tests, 15+ validation/conversion unit tests, format utility tests.
- Tests cover: accessibility (jest-axe), input filtering, base swapping, API conversion, offline fallback, theme persistence, keyboard shortcuts, and history display.
- Added GitHub Actions CI pipeline: lint -> test -> build -> Lighthouse audit.

### Tradeoffs
- **System fonts vs web fonts**: Chose system fonts for zero network latency and smaller bundle. The tradeoff is less unique typography, but modern system fonts (SF Pro, Segoe UI, Inter) look professional.
- **No UI component library**: All components are hand-written with Tailwind utility classes + CSS variables. This keeps the bundle under control but requires more manual work for complex UI patterns.
- **Inline SVG icons vs icon library**: Used inline SVGs to avoid adding a dependency like `lucide-react` or `react-icons`. Slightly more verbose but zero additional bundle cost.
