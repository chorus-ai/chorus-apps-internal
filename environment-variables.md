---
description: Full reference for server/.env, resolved by server/config/env.js
icon: gear
---

# Environment Variables

Server config is resolved by `server/config/env.js`. Copy `server/.env.example` to `server/.env` and fill in what you need. The frontend needs no env vars in dev — it talks to the backend through the Vite proxy.

| Variable | Required | Description |
|----------|----------|--------------|
| `NODE_ENV` | yes | `development` \| `test` \| `production` \| `chorus_dev` \| `chorus_prod`. Selects the DB (SQLite in dev/test, PostgreSQL in prod). |
| `PORT` | yes | Backend port (default `8080`). |
| `HOST` | yes | Public base URL, e.g. `http://localhost:8080`. |
| `APP_NAME` / `APP_VERSION` | no | App metadata. |
| `JWT_SECRET` | yes | Secret for signing JWT auth cookies. |
| `FEATURES` | no | Comma-separated allowlist of features to mount. Empty = all. Available: `omop, vocab, form, assets, cada, ive, m2d, cbw, crc, diet, pair, post, survey, alarmx`. |
| `DB_HOSTNAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | prod only | PostgreSQL app DB (ignored in dev/test — SQLite is used). |
| `MONGO_HOST` | no | MongoDB connection; Mongo-backed features load only if set. |
| `REDIS_HOST`, `REDIS_PORT` | jobs only | Redis for BullMQ (default `127.0.0.1:6379`). |
| `BUCKET_PATH` | no | Local storage path for uploads. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION` | no | S3 storage. Leave keys blank on prod VMs to use the instance role. |
| `PYTHON_PATH` | no | Python interpreter for waveform scripts. |
| `GITHUB_*`, `GOOGLE_*`, `AZURE_*` | no | OAuth client credentials. |

{% hint style="warning" %}
The `FEATURES` allowlist includes names (`cbw`, `crc`, `diet`, `pair`, `post`, `survey`, `alarmx`) beyond the feature folders currently under `server/features/` (`omop`, `vocab`, `form`, `assets`, `cada`, `ive`, `m2d`). Those are reserved for features still in progress — check `server/features/` for what's actually implemented before assuming one is mounted.
{% endhint %}
