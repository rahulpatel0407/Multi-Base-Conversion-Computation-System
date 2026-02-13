# Binary–Decimal Converter (React + Express)

Modern, production-ready base converter with a polished React frontend and a robust Express API.

## Features

- React + Vite + TypeScript + TailwindCSS UI
- Base conversions among 2/8/10/16 with large integer support
- Inline validation and accessible error messaging
- Step-by-step explanations and copy/share permalinks
- Local + server-persisted conversion history
- Keyboard shortcuts and theme toggle
- Express + TypeScript API with lightweight JSON persistence
- Rate limiting, validation, logging, and structured error responses
- Tests (Jest + RTL + Supertest) + GitHub Actions CI + axe checks
- Docker + docker-compose for full-stack dev

## Project Structure

```
/binary-decimal-main
├─ frontend/
├─ server/
├─ shared/
├─ docker-compose.yml
└─ README.md
```

## Local Development

Install dependencies at the repo root:

```
npm install
```

Start dev servers (frontend + backend + shared watcher):

```
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:3000

## Build & Test

```
npm run lint
npm run test
npm run build
```

## Docker

```
docker-compose up --build
```

## API Examples

POST /api/convert

```
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1011","fromBase":2,"toBase":10}'
```

Response shape:

```
{
  "result": "11",
  "steps": ["1×2^3 + 0×2^2 + 1×2^1 + 1×2^0 = 11"],
  "meta": {
    "input": "1011",
    "fromBase": 2,
    "toBase": 10,
    "timestamp": "2026-02-08T12:00:00Z"
  }
}
```

GET /api/history?sessionId=abc123

```
curl http://localhost:3000/api/history?sessionId=abc123
```

GET /api/health

```
curl http://localhost:3000/api/health
```

## Frontend Optimization — How to Run & Test

The frontend has been redesigned for simplicity, performance, and accessibility. See `FRONTEND_CHANGELOG.md` for full details.

### Run the frontend

```bash
# From the repo root
npm install
npm run dev          # starts shared watcher + server + frontend
```

Or run just the frontend:

```bash
cd frontend
npm run dev          # Vite dev server at http://localhost:5173
```

### Build for production

```bash
npm run build -w shared && npm run build -w frontend
npx vite preview --root frontend   # preview production build
```

### Run frontend tests

```bash
npm run test -w frontend
```

Tests cover:
- Accessibility (jest-axe, no violations)
- Input validation for each base (binary, octal, decimal, hex)
- Conversion flows (API and offline fallback)
- Base swapping, input filtering, clear behavior
- Theme toggle and localStorage persistence
- Keyboard shortcuts (?, Ctrl+K, Enter, Escape)
- History panel display
- URL permalink parsing
- Format utilities

### Lint

```bash
npm run lint -w frontend
```

### Component overview

| Component | Responsibility |
|---|---|
| `App` | Top-level state, routing, keyboard shortcuts |
| `Header` | Title, theme toggle, shortcuts button |
| `ConverterCard` | Base selectors (segmented control), input, convert/swap/clear |
| `BaseSelector` | Reusable segmented radio-group for base selection |
| `ResultCard` | Displays result with copy & share icons |
| `StepsPanel` | Lazy-loaded collapsible conversion steps |
| `HistoryPanel` | Collapsible session history with reuse, delete, CSV export |
| `ShortcutsModal` | Keyboard shortcut cheat sheet (? to toggle) |
| `Toast` | Ephemeral notification with enter/exit animations |

### Keyboard shortcuts

| Key | Action |
|---|---|
| `Enter` | Convert |
| `Ctrl/Cmd + K` | Focus input |
| `Alt + Arrow` | Change from-base |
| `?` | Toggle shortcuts modal |
| `Esc` | Close modal |

### Design decisions

- **System fonts** over web fonts — zero network latency, smaller bundle
- **CSS variables** for all theme tokens — easy to add new themes
- **No UI library** — hand-written components with Tailwind keep the bundle small
- **Inline SVG icons** — no icon library dependency
- **Lazy-loaded StepsPanel** — reduces initial JS payload

## Tradeoffs

- JSON file persistence for compatibility with Windows without native builds.
- Shared conversion package is built and watched in dev for reliability across client/server.

## Next Improvements

- Add PWA offline mode
- Add server-side CSV export
- Add analytics endpoint for feature usage
