# CHoRUS Apps! 🌍

Full-stack healthcare SPA with a **React/Vite** frontend and a **Node.js/Express**
backend. The frontend hosts multiple feature apps (CADA, IVE, M2D, CBW, CRC)
within a single bundle. On the backend, each domain lives in a self-contained
`features/<name>/` folder while cross-cutting infrastructure stays in flat
top-level folders (`config/`, `middleware/`, `models/`, `routes/`, `services/`,
`swagger/`, `utils/`). Feature mounting is gated by an env var.

---

## 📁 Project Structure

```
.
├── client/                # React 19 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── apps/          # Feature apps: cada, ive, m2d
│   │   ├── common/        # Shared UI
│   │   ├── store/         # Redux Toolkit store (main + per-app slices)
│   │   └── App.tsx
│   ├── vite.config.ts     # Dev proxy: /api & /docs → :8080
│   └── README.md          # Client-specific docs
├── server/                # Express backend
│   ├── config/env.js      # Env resolver (NODE_ENV→DB, FEATURES, host)
│   ├── middleware/auth.js # JWT auth middleware
│   ├── models/            # Base Sequelize models + loader
│   ├── routes/            # Route mounting (flat core + features/<name>)
│   ├── services/, handler/, utils/   # Cross-cutting helpers
│   ├── swagger/           # OpenAPI assembly (base + features/*/swagger.json)
│   ├── features/<name>/   # models, handlers, routes, services, jobs, swagger.json
│   ├── server.js          # HTTP entry
│   ├── worker.js          # BullMQ background-job worker
│   └── .env.example       # Environment template
└── README.md
```

---

## ✅ Prerequisites

- **Node.js v22+**
- **Redis** — only if you run background jobs (`worker.js`)
- **Python 3** with `wfdb`/`numpy` — only for waveform/scoring features
- App data: SQLite in dev (auto, under `server/data/`), PostgreSQL in prod

---

## 🚀 Getting Started

The client and server are independent npm projects — run them in separate
terminals. There is no root `package.json`.

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure the server environment

```bash
cd server
cp .env.example .env       # then edit values (see Environment Variables below)
```

### 3. Run the backend

```bash
cd server
npm start                  # Express on http://localhost:8080
```

Optional — background jobs (requires Redis running):

```bash
cd server
node worker.js             # boots one BullMQ worker per enabled feature
```

### 4. Run the frontend

```bash
cd client
npm run dev                # Vite on http://localhost:5173
```

The Vite dev server proxies `/api` and `/docs` to the backend on port `8080`,
so start the server first.

### Production build (client)

```bash
cd client
npm run build              # outputs to dist/ (served statically by the server)
```

---

## 🔐 Environment Variables

Server config is resolved by `server/config/env.js`. Copy
`server/.env.example` to `server/.env` and fill in what you need. The frontend
needs no env vars in dev (it talks to the backend through the Vite proxy).

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | yes | `development` \| `test` \| `production` \| `chorus_dev` \| `chorus_prod`. Selects the DB (SQLite in dev/test, PostgreSQL in prod). |
| `PORT` | yes | Backend port (default `8080`). |
| `HOST` | yes | Public base URL, e.g. `http://localhost:8080`. |
| `APP_NAME` / `APP_VERSION` | no | App metadata. |
| `JWT_SECRET` | yes | Secret for signing JWT auth cookies. |
| `FEATURES` | no | Comma-separated allowlist of features to mount. Empty = all. Available: `omop,vocab,form,assets,cada,ive,m2d,cbw,crc,diet,pair,post,survey,alarmx`. |
| `DB_HOSTNAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | prod only | PostgreSQL app DB (ignored in dev/test — SQLite is used). |
| `MONGO_HOST` | no | MongoDB connection; Mongo features load only if set. |
| `REDIS_HOST`, `REDIS_PORT` | jobs only | Redis for BullMQ (default `127.0.0.1:6379`). |
| `BUCKET_PATH` | no | Local storage path for uploads. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` | no | S3 storage. Leave keys blank on prod VMs to use the instance role. |
| `PYTHON_PATH` | no | Python interpreter for waveform scripts. |
| `GITHUB_*`, `GOOGLE_*`, `AZURE_*` | no | OAuth client credentials. |

---

## 🔁 How It Fits Together

- **Auth** — JWT in an httpOnly cookie. The client sends credentials on every
  request and redirects to `/signin` on `401`. The server verifies the JWT on
  all `/api` routes except a public allowlist.
- **Databases** — App DB (users/RBAC), OMOP DB (clinical data), and Vocab DB
  via Sequelize; MongoDB optional.
- **Background jobs** — BullMQ over Redis; each feature ships its own queue and
  processor under `features/<name>/jobs/`, loaded by `worker.js`.
- **API docs** — OpenAPI assembled by `swagger/index.js` from a base spec plus
  each feature's `swagger.json`, served at `/docs`.

---

## 🙌 Contributions Welcome

Feel free to fork this repo, submit issues, or open pull requests to improve the project!

