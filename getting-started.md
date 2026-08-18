---
description: Install dependencies, configure the environment, and run CHoRUS Apps locally
icon: rocket
---

# Getting Started

## Prerequisites

* **Node.js v22+**
* **Redis** — only if you run background jobs (`worker.js`)
* **Python 3** with `wfdb`/`numpy` — only for waveform/scoring features
* App data: SQLite in dev (auto-created under `server/data/`), PostgreSQL in prod

{% hint style="info" %}
The client and server are independent npm projects — run them in separate terminals. There is no root `package.json`.
{% endhint %}

## 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Configure the server environment

```bash
cd server
cp .env.example .env       # then edit values — see Environment Variables
```

## 3. Run the backend

```bash
cd server
npm start                  # Express on http://localhost:8080
```

Optional — background jobs (requires Redis running):

```bash
cd server
node worker.js             # boots one BullMQ worker per enabled feature
```

## 4. Run the frontend

```bash
cd client
npm run dev                # Vite on http://localhost:5173
```

The Vite dev server proxies `/api` and `/docs` to the backend on port `8080`, so start the server first.

## Production build (client)

```bash
cd client
npm run build              # outputs to dist/, served statically by the server
```

## Next steps

* [Architecture](architecture.md) — how the pieces fit together
* [Environment Variables](environment-variables.md) — full reference for `server/.env`
* [Features](features.md) — what each feature app does
