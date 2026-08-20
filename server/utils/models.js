const fs = require("fs");
const path = require('path');
const Sequelize = require("sequelize");

const loadSequelizeModels = ({ directory, db, basename, instances }) => {
  fs.readdirSync(directory, { withFileTypes: true })
    .forEach((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        loadSequelizeModels({ directory: entryPath, db, basename, instances });
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".js") &&
        entry.name !== basename &&
        !entry.name.endsWith("_relations.js")
      ) {
        console.log(`Loading model: ${directory}/${entry.name}`);
        const modelDefinition = require(entryPath);

        const feature = path.basename(directory);
        const sequelize = instances[feature] || instances.app;
        const model = modelDefinition(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      }
    });
};

const loadMongooseModels = (directory, basename) => {
  const db = {};
  fs.readdirSync(directory, { withFileTypes: true })
    .forEach(entry => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        loadModels(entryPath);
      } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== basename && !entry.name.endsWith('_relations.js') && !entry.name.endsWith('index.js')) {
        console.log(`Loading mongoose model: ${directory}/${entry.name}`);
        const model = require(entryPath);
        console.log(`Model loaded: ${model.modelName}`);
        db[model.modelName] = model;
      }
    });
  
  return db;
}

module.exports = { loadSequelizeModels, loadMongooseModels };