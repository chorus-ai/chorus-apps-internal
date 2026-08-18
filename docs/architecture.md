---
description: How the client, server, features, databases, and background jobs fit together
icon: sitemap
---

# Architecture

## Project structure

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
│   ├── config/env.js      # Env resolver (NODE_ENV → DB, FEATURES, host)
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

Each backend feature is self-contained: a `features/<name>/` folder can carry its own `models/`, `handlers/`, `routes/`, `services/`, `jobs/`, and `swagger.json`. Cross-cutting infrastructure that every feature shares — auth, env config, base models, the route mounter, the Swagger assembler — stays in the flat top-level server folders instead of being duplicated per feature.

Feature mounting is gated by the `FEATURES` environment variable: unset means every feature loads, otherwise only the comma-separated allowlist mounts. This lets a given deployment ship just the features it needs.

## How it fits together

* **Auth** — JWT in an httpOnly cookie. The client sends credentials on every request and redirects to `/signin` on `401`. The server verifies the JWT on all `/api` routes except a public allowlist.
* **Databases** — App DB (users/RBAC), OMOP DB (clinical data), and Vocab DB via Sequelize; MongoDB is optional and only loads Mongo-backed features when `MONGO_HOST` is set. SQLite is used automatically in dev/test; PostgreSQL in production (selected by `NODE_ENV` in `server/config/env.js`).
* **Background jobs** — BullMQ over Redis. Each feature ships its own queue and processor under `features/<name>/jobs/`, loaded by `worker.js` — one worker process per enabled feature.
* **API docs** — OpenAPI is assembled by `server/swagger/index.js` from a base spec plus each feature's `swagger.json`, and served at `/docs`. See [API Reference](api-reference.md).
* **Storage** — File uploads go to local disk (`BUCKET_PATH`) or S3, depending on configuration.

## Frontend

The client is a single React/Vite bundle that hosts multiple feature apps under `client/src/apps/` (currently `cada` and `ive`; `m2d` is server-only so far). Each app owns its own routes, pages, and Redux slice; `client/src/store/` composes them into one store. In dev, Vite proxies `/api` and `/docs` to the backend on port `8080`, so the two servers behave as one origin during local development.
