# Client

React/Vite frontend for the Hulab healthcare SPA. A single bundle hosts
multiple feature apps (CADA, IVE, M2D, CBW, CRC), each with its own routes,
Redux state, and components.

## Tech Stack

- **React 19** with **TypeScript**
- **Vite 7** — dev server and production build
- **React Router 7** — routing (global routes in `App.tsx`, per-app nested routes)
- **Redux Toolkit 2** — state (single store, per-app slices)
- **MUI 7** — component library and theming
- **Axios** — HTTP client (cookie-based auth, 401 redirect)
- **ECharts** — charts and waveform rendering

## Getting Started

### Prerequisites
- Node.js v22+
- A running backend on `http://localhost:8080` (see `../server`)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev      # Vite dev server on http://localhost:5173
```
The dev server proxies `/api` and `/docs` to the backend on port `8080`.

### Other commands
```bash
npm run build    # Production build to dist/
npm run preview  # Preview the production build
npm run lint     # ESLint
```

## Project Structure

```
client/
├── public/
├── src/
│   ├── apps/        # Feature apps: cada, ive, m2d, cbw, crc
│   │   └── <app>/   #   each: routes.tsx, store slice, pages, components
│   ├── common/      # Shared UI components
│   ├── hooks/       # Typed Redux hooks (useAppDispatch/useAppSelector) + others
│   ├── layouts/     # Page layouts
│   ├── pages/       # Top-level pages (auth, profile, errors)
│   ├── store/       # Redux store (main + per-app reducers)
│   ├── utils/       # Axios instance, helpers
│   ├── App.tsx      # Root: Provider, theme, SessionLoader, top-level routes
│   └── main.tsx     # Entry point
├── vite.config.ts   # Vite config + /api & /docs proxy, "@" path alias
└── package.json
```

## Auth

`SessionLoader` in `App.tsx` calls `GET /api/auth/me` on mount and dispatches
the login state. `src/utils/axios.ts` sends credentials with every request and
redirects to `/signin` on a 401. Non-public routes are wrapped in
`<ProtectedRoute>`.

## Notes

- `dist/` (build output) is not tracked in version control.
- TypeScript strict mode is intentionally relaxed in app code during the
  JS→TS migration.
