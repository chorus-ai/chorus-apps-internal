"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + '/../config/config.js');
const db = {};

let sequelize_app, sequelize_omop;
if (env === 'development') {
  console.log("Using development environment");
  sequelize_app = new Sequelize(config.development.sqlite_app);
  sequelize_omop = new Sequelize(config.development.sqlite_omop);
} else if (env === 'test') {
  console.log("Using test environment");
  const configTest = config.test;
  sequelize_app = sequelize_omop = new Sequelize(configTest.storage, configTest);
} else if (env === 'production') {
  console.log("Using production environment");
  sequelize_app = new Sequelize(config.production.db_app);
  sequelize_omop = new Sequelize(config.production.db_omop);
}

fs.readdirSync(__dirname) 
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {

    if (file.startsWith("omop")) {
      const modelDefinition = require(path.join(__dirname, file));
      const model = modelDefinition(sequelize_omop, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      const modelDefinition = require(path.join(__dirname, file));
      const model= modelDefinition(sequelize_app, Sequelize.DataTypes);
      db[model.name] = model;
    }
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
})
db.feature.belongsToMany(db.user, {
  through: db.featureUser,
  sourceKey: "id",
  targetKey: "id",
})
db.user.hasMany(db.log);
db.log.belongsTo(db.user);

// ------------------------ CADA relations ------------------------

db.user.hasMany(db.cadaAnnotation);
db.cadaAnnotation.belongsTo(db.user);

db.cadaEvent.hasMany(db.cadaAnnotation);
db.cadaAnnotation.belongsTo(db.cadaEvent);

db.cadaAnnotation.hasMany(db.cadaAnnotationValue);
db.cadaAnnotationValue.belongsTo(db.cadaAnnotation);

db.user.hasMany(db.cadaAdjudicationValue);
db.cadaAdjudicationValue.belongsTo(db.user);

db.cadaEvent.hasMany(db.cadaAdjudicationValue);
db.cadaAdjudicationValue.belongsTo(db.cadaEvent);

db.cadaFile.hasMany(db.cadaEvent);
db.cadaEvent.belongsTo(db.cadaFile);

db.cadaProject.hasMany(db.cadaEvent);
db.cadaEvent.belongsTo(db.cadaProject);

db.cadaProject.hasMany(db.cadaProjectUser);
db.user.hasMany(db.cadaProjectUser, { onDelete: "cascade", hooks: true });
db.cadaProjectUser.belongsTo(db.user);

db.user.hasOne(db.cadaBot, {
  foreignKey: {
    allowNull: false,
  },
});

// ------------------------ OMOP relations ------------------------

db.person.belongsTo(db.concept, { foreignKey: 'gender_concept_id' });
db.person.belongsTo(db.concept, { foreignKey: 'race_concept_id' });
db.person.belongsTo(db.concept, { foreignKey: 'ethnicity_concept_id' });
db.person.belongsTo(db.concept, { foreignKey: 'gender_source_concept_id' });
db.person.belongsTo(db.concept, { foreignKey: 'race_source_concept_id' });
db.person.belongsTo(db.concept, { foreignKey: 'ethnicity_source_concept_id' });

db.observation_period.belongsTo(db.person, { foreignKey: 'person_id' });
db.observation_period.belongsTo(db.concept, { foreignKey: 'period_type_concept_id' });

db.visit_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
db.visit_occurrence.belongsTo(db.concept, { foreignKey: 'visit_concept_id' });
db.visit_occurrence.belongsTo(db.concept, { foreignKey: 'visit_type_concept_id' });
db.visit_occurrence.belongsTo(db.concept, { foreignKey: 'visit_source_concept_id' });
db.visit_occurrence.belongsTo(db.concept, { foreignKey: 'admitted_from_concept_id' });
db.visit_occurrence.belongsTo(db.concept, { foreignKey: 'discharged_to_concept_id' });

db.visit_detail.belongsTo(db.person, { foreignKey: 'person_id' });
db.visit_detail.belongsTo(db.concept, { foreignKey: 'visit_detail_concept_id' });
db.visit_detail.belongsTo(db.concept, { foreignKey: 'visit_detail_type_concept_id' });
db.visit_detail.belongsTo(db.concept, { foreignKey: 'visit_detail_source_concept_id' });
db.visit_detail.belongsTo(db.concept, { foreignKey: 'admitted_from_concept_id' });
db.visit_detail.belongsTo(db.concept, { foreignKey: 'discharged_to_concept_id' });
db.visit_detail.belongsTo(db.visit_detail, { foreignKey: 'preceding_visit_detail_id' });
db.visit_detail.belongsTo(db.visit_detail, { foreignKey: 'parent_visit_detail_id' });
db.visit_detail.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });

db.condition_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
db.condition_occurrence.belongsTo(db.concept, { foreignKey: 'condition_concept_id' });
db.condition_occurrence.belongsTo(db.concept, { foreignKey: 'condition_type_concept_id' });
db.condition_occurrence.belongsTo(db.concept, { foreignKey: 'condition_status_concept_id' });
db.condition_occurrence.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.condition_occurrence.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
db.condition_occurrence.belongsTo(db.concept, { foreignKey: 'condition_source_concept_id' });

db.drug_exposure.belongsTo(db.person, { foreignKey: 'person_id' });
db.drug_exposure.belongsTo(db.concept, { foreignKey: 'drug_concept_id' });
db.drug_exposure.belongsTo(db.concept, { foreignKey: 'drug_type_concept_id' });
db.drug_exposure.belongsTo(db.concept, { foreignKey: 'route_concept_id' });
db.drug_exposure.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.drug_exposure.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
db.drug_exposure.belongsTo(db.concept, { foreignKey: 'drug_source_concept_id' });

db.procedure_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
db.procedure_occurrence.belongsTo(db.concept, { foreignKey: 'procedure_concept_id' });
db.procedure_occurrence.belongsTo(db.concept, { foreignKey: 'procedure_type_concept_id' });
db.procedure_occurrence.belongsTo(db.concept, { foreignKey: 'modifier_concept_id' });
db.procedure_occurrence.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.procedure_occurrence.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
db.procedure_occurrence.belongsTo(db.concept, { foreignKey: 'procedure_source_concept_id' });

db.death.belongsTo(db.person, { foreignKey: 'person_id' });
db.death.belongsTo(db.concept, { foreignKey: 'death_type_concept_id' });
db.death.belongsTo(db.concept, { foreignKey: 'cause_concept_id' });
db.death.belongsTo(db.concept, { foreignKey: 'cause_source_concept_id' });

db.note.belongsTo(db.person, { foreignKey: 'person_id' });
db.note.belongsTo(db.concept, { foreignKey: 'note_type_concept_id' });
db.note.belongsTo(db.concept, { foreignKey: 'note_class_concept_id' });
db.note.belongsTo(db.concept, { foreignKey: 'encoding_concept_id' });
db.note.belongsTo(db.concept, { foreignKey: 'language_concept_id' });
db.note.belongsTo(db.concept, { foreignKey: 'note_event_field_concept_id' });
db.note.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.note.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

db.note_nlp.belongsTo(db.note, { foreignKey: 'note_id' }); 
db.note_nlp.belongsTo(db.concept, { foreignKey: 'section_concept_id' });
db.note_nlp.belongsTo(db.concept, { foreignKey: 'note_nlp_concept_id' });
db.note_nlp.belongsTo(db.concept, { foreignKey: 'note_nlp_source_concept_id' });

db.device_exposure.belongsTo(db.person, { foreignKey: 'person_id' });
db.device_exposure.belongsTo(db.concept, { foreignKey: 'device_concept_id' });
db.device_exposure.belongsTo(db.concept, { foreignKey: 'device_type_concept_id' });
db.device_exposure.belongsTo(db.concept, { foreignKey: 'route_concept_id' }); 
db.device_exposure.belongsTo(db.concept, { foreignKey: 'device_source_concept_id' });
db.device_exposure.belongsTo(db.concept, { foreignKey: 'unit_concept_id' });
db.device_exposure.belongsTo(db.concept, { foreignKey: 'unit_source_concept_id' });
db.device_exposure.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.device_exposure.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

db.observation.belongsTo(db.person, { foreignKey: 'person_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'observation_concept_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'observation_type_concept_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'value_as_concept_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'qualifier_concept_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'unit_concept_id' });
db.observation.belongsTo(db.concept, { foreignKey: 'observation_source_concept_id' });
db.observation.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.observation.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

db.measurement.belongsTo(db.person, { foreignKey: 'person_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_type_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'operator_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'value_as_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'unit_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_source_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'unit_source_concept_id' });
db.measurement.belongsTo(db.concept, { foreignKey: 'meas_event_field_concept_id' });
db.measurement.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
db.measurement.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

db.sequelize_app = sequelize_app;
db.sequelize_omop = sequelize_omop;
db.Sequelize = Sequelize;

module.exports = db;