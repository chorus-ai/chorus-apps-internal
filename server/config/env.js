"use strict";

// Single environment resolver. Reads process.env ONCE and exposes a typed
// config object.

require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";

// FEATURES toggle: comma-separated allowlist of features to mount at boot.
// Unset/empty => null => ALL features load (preserves pre-toggle behaviour).
const features = process.env.FEATURES
  ? process.env.FEATURES.split(",").map((s) => s.trim()).filter(Boolean)
  : null;
const isFeatureEnabled = (name) => features === null || features.includes(name);

// ---- DB connection builders ----
const sqlite = {
  app:    { dialect: "sqlite", storage: "data/db.sqlite3" },
  omop:   { dialect: "sqlite", storage: "data/omop.sqlite3" },
  vocab:  { dialect: "sqlite", storage: "data/db.sqlite3" },
};

const test = { dialect: "sqlite", storage: ":memory:" };

const pg = (schema) => ({
  dialect: "postgres",
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  define: { schema },
});

const postgres = {
  app: pg("app"),
  omop: pg("omopcdm"),
  vocab: pg("vocabulary"),
};

// Per-NODE_ENV selection — behaviourally identical to the old switch in
// models/index.js (including the `test` case sharing one instance for
// app+omop). Returns the option objects passed to `new Sequelize(...)`.
const selectDb = (env = nodeEnv) => {
  switch (env) {
    case "development":
      return { app: sqlite.app, omop: sqlite.omop, vocab: sqlite.vocab, shared: false };
    case "test":
      return { app: test, omop: test, vocab: test, shared: true };
    case "production":
      return { app: postgres.app, omop: postgres.omop, vocab: postgres.vocab, shared: false };
    case "chorus_dev":
      return { app: postgres.app, omop: sqlite.omop, vocab: sqlite.vocab, shared: false };
    case "chorus_prod":
      return { app: postgres.app, omop: postgres.omop, vocab: postgres.vocab, shared: false };
    default:
      throw new Error(`Unknown NODE_ENV: ${env}`);
  }
};

module.exports = {
  nodeEnv,
  features,
  isFeatureEnabled,
  port: process.env.PORT || 8080,
  host: process.env.APP_HOST,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  mongoHost: process.env.MONGO_HOST,
  bucketPath: process.env.BUCKET_PATH,

  // Raw builders (for any consumer that needs the unresolved option objects).
  db: { sqlite, test, postgres },
  selectDb,
};
