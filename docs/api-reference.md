---
description: Explore the assembled OpenAPI spec for every mounted feature
icon: terminal
---

# API Reference

The backend assembles its own OpenAPI spec at runtime: `server/swagger/index.js` merges a base spec with each mounted feature's `swagger.json` (currently `omop`, `assets`, `cada`, and `ive` ship one). The result is served at:

```
GET /docs
```

When running the server locally per [Getting Started](getting-started.md), that's `http://localhost:8080/docs`; the Vite dev server also proxies `/docs`, so it's reachable at `http://localhost:5173/docs` while `npm run dev` is running.

## Servers

The spec advertises three environments:

| Environment | URL |
|---|---|
| Local development | `http://localhost:8080/api` |
| Azure production | `https://mgh-chorus.eastus2.cloudapp.azure.com/api` |
| AWS production | `https://nursingdatascience.emory.edu/api` |

## Snapshot

A point-in-time export of the assembled spec is checked into this space at [`.gitbook/assets/swagger.json`](../.gitbook/assets/swagger.json) for reference when a running server isn't handy. It covers auth, user, feature, and bucket management plus the OMOP, vocabulary, CADA, and IVE endpoints described in [Features](features.md). Prefer the live `/docs` endpoint over this snapshot when the two disagree.

## Auth for API calls

Most routes require a JWT, issued via `POST /auth/login` and returned as an httpOnly cookie. Requests without a valid cookie get a `401` on any `/api` route outside the public allowlist. See [Architecture](architecture.md#how-it-fits-together).
