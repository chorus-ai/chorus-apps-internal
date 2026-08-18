---
description: Documentation for the CHoRUS Apps developer platform
icon: house
layout:
  width: wide
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: false
  outline:
    visible: false
  pagination:
    visible: false
  metadata:
    visible: false
  tags:
    visible: true
  actions:
    visible: true
---

# CHoRUS Apps

CHoRUS Apps is a full-stack healthcare application platform with a **React/Vite** frontend and a **Node.js/Express** backend. The frontend hosts multiple feature apps — **CADA**, **IVE**, and **M2D** — within a single bundle. On the backend, each domain lives in a self-contained `features/<name>/` folder, while cross-cutting infrastructure (auth, config, models, routes, services) stays in flat top-level folders. Feature mounting is controlled by an environment variable, so a deployment can enable only the features it needs.

<table data-view="cards"><thead><tr><th></th><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Getting Started</strong></td><td>Install dependencies, configure the environment, and run the client and server locally.</td><td></td><td><a href="getting-started.md">getting-started.md</a></td></tr><tr><td><strong>Architecture</strong></td><td>How the client, server, features, databases, and background jobs fit together.</td><td></td><td><a href="architecture.md">architecture.md</a></td></tr><tr><td><strong>Features</strong></td><td>What each feature app (CADA, IVE, M2D, OMOP, Vocabulary, Form, Assets) does.</td><td></td><td><a href="features.md">features.md</a></td></tr><tr><td><strong>Environment Variables</strong></td><td>Every variable the server reads, what it's for, and when it's required.</td><td></td><td><a href="environment-variables.md">environment-variables.md</a></td></tr><tr><td><strong>API Reference</strong></td><td>Explore the assembled OpenAPI spec for every mounted feature.</td><td></td><td><a href="api-reference.md">api-reference.md</a></td></tr></tbody></table>

{% hint style="info" %}
This documentation describes the platform as implemented on the `develop` branch. If you're working directly in the code, the root [`README.md`](https://github.com/chorus-ai/chorus-apps-internal/blob/develop/README.md) on that branch is the source of truth and may be more current than this space.
{% endhint %}
