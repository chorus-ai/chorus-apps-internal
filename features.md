---
description: What each feature app does and how it's organized
icon: puzzle-piece
---

# Features

Each feature is a self-contained folder under `server/features/<name>/`, optionally paired with a client app under `client/src/apps/<name>/`. A feature is only mounted if it's included in the `FEATURES` allowlist (or if `FEATURES` is unset, in which case every feature mounts). See [Environment Variables](environment-variables.md).

## CADA

**Server:** `server/features/cada/` (models, handlers, routes, services, jobs, `swagger.json`) · **Client:** `client/src/apps/cada/`

CADA manages projects, events, and files:

* `cadaProject` — project management
* `cadaEvent` — event management
* `cadaFile` — file management

It's the only feature (besides OMOP/IVE) with its own background jobs under `features/cada/jobs/`, loaded by `worker.js`.

## IVE

**Server:** `server/features/ive/` (models, handlers, routes, services, `swagger.json`) · **Client:** `client/src/apps/ive/`

IVE is a dashboarding layer over OMOP data:

* `iveEndpoint` — saved OMOP API endpoints
* `iveLayout` — dashboard layout management
* `iveWidget` — widget template management
* `iveTag` — tagging for IVE layouts, widgets, and endpoints

## M2D

**Server:** `server/features/m2d/` (models, handlers, routes, services)

M2D ("Model to Data") is server-only so far — no client app exists yet under `client/src/apps/`. Its routes cover a model registry/workflow: `admin`, `comments`, `models`, `modelstar` (starring/favoriting), `projects`, `results`, `search`, `userinfo`.

## OMOP

**Server:** `server/features/omop/` (models, handlers, routes, services, `swagger.json`, 54 endpoints)

Exposes the OMOP Common Data Model clinical data tables. This is the largest feature by API surface and is what IVE's saved endpoints query against.

## Vocabulary

**Server:** `server/features/vocab/` (models, handlers, routes, services)

Concept lookups against the OMOP vocabulary database (`concept.js` route).

## Form

**Server:** `server/features/form/` (models, handlers, routes, services)

Dynamic form definitions and submissions (`form.js` route).

## Assets

**Server:** `server/features/assets/` (models, handlers, routes, services, `swagger.json`, 4 endpoints)

Generic asset/file management, backing uploads to local disk (`BUCKET_PATH`) or S3.

---

For exact request/response shapes, see the assembled [API Reference](api-reference.md) rather than this page — feature implementations change faster than this doc does.
