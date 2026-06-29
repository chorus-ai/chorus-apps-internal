"use strict";

const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = require("../config/env");
const { loadRelations } = require("../utils/relations");
const { loadSequelizeModels } = require("../utils/models");
const { loadFeatureModels, loadFeatureRelations, bootSummary } = require("../utils/feature");
const db = {};

// ---------- Boot banner + FEATURES validation ----------
const _featuresDir = path.join(__dirname, "..", "features");
const _summary = bootSummary(_featuresDir);
console.log(`[boot] env=${env.nodeEnv} features=[${_summary.loaded.join(",")}]`);
console.log(`[boot] skipped (not in FEATURES): ${_summary.skipped.length ? _summary.skipped.join(",") : "-"}`);
if (env.features !== null) {
  const unknown = env.features.filter((f) => ![..._summary.loaded, ..._summary.skipped].includes(f));
  if (unknown.length) console.warn(`[boot] WARNING: FEATURES lists unknown feature(s): ${unknown.join(",")}`);
}

// ---------- Initialize Sequelize instances (env-resolved) ----------
console.log(`Using ${env.nodeEnv} environment`);
const dbCfg = env.selectDb();
const sequelize_app = new Sequelize(dbCfg.app);
// `test` historically shared one in-memory instance for app + omop.
const sequelize_omop = dbCfg.shared ? sequelize_app : new Sequelize(dbCfg.omop);
const sequelize_vocab = new Sequelize(dbCfg.vocab);

// Core (cross-cutting) models live alongside this file; legacy per-feature
// models live in subfolders under server/models/. Single recursive scan picks
// up both. loadSequelizeModels skips this index.js via the `basename` guard.
loadSequelizeModels({
  directory: __dirname,
  db,
  basename,
  sequelize_app,
  sequelize_omop,
  sequelize_vocab,
});

// Migrated features under features/<name>/models/ (bound by feature name).
loadFeatureModels({
  directory: __dirname,
  featuresDir: path.join(__dirname, "..", "features"),
  db,
  instances: { sequelize_app, sequelize_omop, sequelize_vocab },
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ------------------------ App relations ------------------------

db.feature.hasMany(db.featureUser);
db.user.hasMany(db.featureUser, { onDelete: "cascade", hooks: true });
db.featureUser.belongsTo(db.user);
db.user.belongsToMany(db.feature, {
  through: db.featureUser,
  sourceKey: "id",
  targetKey: "id",
});
db.feature.belongsToMany(db.user, {
  through: db.featureUser,
  sourceKey: "id",
  targetKey: "id",
});
db.user.hasMany(db.log);
db.log.belongsTo(db.user);

//------------------------ Features relations ------------------------

loadRelations({ directory: __dirname, db });
loadFeatureRelations({ featuresDir: path.join(__dirname, "..", "features"), db });

db.sequelize_app = sequelize_app;
db.sequelize_omop = sequelize_omop;
db.sequelize_vocab = sequelize_vocab;
db.Sequelize = Sequelize;

module.exports = db;