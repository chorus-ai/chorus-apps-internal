"use strict";

// Incremental-migration loaders: scan a `features/` root alongside the legacy
// flat `models/ handler/ routes/ services/` dirs, so features can be moved one
// at a time without breaking the ones still flat.
//
// A feature folder looks like:
//   features/<name>/models/      -> Sequelize model definitions
//   features/<name>/_relations.js-> associations (optional)
//   features/<name>/handlers/
//   features/<name>/routes/      -> mounted at /api/<name>/...
//   features/<name>/services/

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

// Which Sequelize instance a feature's models bind to.
const instanceFor = (feature, instances) => instances[feature] || instances.app;

const env = require("../config/env");

const eachFeature = (featuresDir, fn) => {
  if (!fs.existsSync(featuresDir)) return;
  fs.readdirSync(featuresDir, { withFileTypes: true }).forEach((entry) => {
    if (!entry.isDirectory()) return;
    if (!env.isFeatureEnabled(entry.name)) return; // FEATURES allowlist
    fn(entry.name, path.join(featuresDir, entry.name));
  });
};

const walkModels = (dir, register) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkModels(p, register);
    else if (
      entry.isFile() &&
      entry.name.endsWith(".js") &&
      !entry.name.endsWith("_relations.js")
    ) {
      register(p);
    }
  });
};

const loadFeatureModels = ({ featuresDir, db, instances }) => {
  eachFeature(featuresDir, (feature, featureDir) => {
    const modelsDir = path.join(featureDir, "models");
    if (!fs.existsSync(modelsDir)) return;
    const sequelize = instanceFor(feature, instances);
    walkModels(modelsDir, (filePath) => {
      console.log(`Loading feature model: ${feature}/${path.basename(filePath)}`);
      const model = require(filePath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
  });
};

// Relations live at the feature root (features/<name>/_relations.js), hoisted
// out of models/ per the target structure.
const loadFeatureRelations = ({ featuresDir, db }) => {
  eachFeature(featuresDir, (feature, featureDir) => {
    const rel = path.join(featureDir, "_relations.js");
    if (fs.existsSync(rel)) {
      console.log(`Loading feature relations: ${feature}/_relations.js`);
      require(rel)(db);
    }
  });
};

module.exports = { loadFeatureModels, loadFeatureRelations };
