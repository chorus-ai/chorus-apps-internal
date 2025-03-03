module.exports = (db) => {
<<<<<<< HEAD
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
=======

  db.observation_period.belongsTo(db.person, { foreignKey: 'person_id' });

  db.death.belongsTo(db.person, { foreignKey: 'person_id' });
  
  db.visit_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
  
  db.visit_detail.belongsTo(db.person, { foreignKey: 'person_id' });
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
  db.visit_detail.belongsTo(db.visit_detail, { foreignKey: 'preceding_visit_detail_id' });
  db.visit_detail.belongsTo(db.visit_detail, { foreignKey: 'parent_visit_detail_id' });
  db.visit_detail.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  
  db.condition_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
<<<<<<< HEAD
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
=======
  db.condition_occurrence.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.condition_occurrence.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

  db.drug_exposure.belongsTo(db.person, { foreignKey: 'person_id' });
  db.drug_exposure.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.drug_exposure.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
  
  db.procedure_occurrence.belongsTo(db.person, { foreignKey: 'person_id' });
  db.procedure_occurrence.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.procedure_occurrence.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });

  db.note.belongsTo(db.person, { foreignKey: 'person_id' });
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
  db.note.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.note.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
  
  db.note_nlp.belongsTo(db.note, { foreignKey: 'note_id' });
<<<<<<< HEAD
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
=======
  
  db.device_exposure.belongsTo(db.person, { foreignKey: 'person_id' });
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
  db.device_exposure.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.device_exposure.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
  
  db.observation.belongsTo(db.person, { foreignKey: 'person_id' });
<<<<<<< HEAD
  db.observation.belongsTo(db.concept, { foreignKey: 'observation_concept_id' });
  db.observation.belongsTo(db.concept, { foreignKey: 'observation_type_concept_id' });
  db.observation.belongsTo(db.concept, { foreignKey: 'value_as_concept_id' });
  db.observation.belongsTo(db.concept, { foreignKey: 'qualifier_concept_id' });
  db.observation.belongsTo(db.concept, { foreignKey: 'unit_concept_id' });
  db.observation.belongsTo(db.concept, { foreignKey: 'observation_source_concept_id' });
=======
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
  db.observation.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.observation.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
  
  db.measurement.belongsTo(db.person, { foreignKey: 'person_id' });
<<<<<<< HEAD
  db.concept.hasMany(db.measurement, { foreignKey: 'measurement_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_type_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'operator_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'value_as_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'unit_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'measurement_source_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'unit_source_concept_id' });
  db.measurement.belongsTo(db.concept, { foreignKey: 'meas_event_field_concept_id' });
=======
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
  db.measurement.belongsTo(db.visit_occurrence, { foreignKey: 'visit_occurrence_id' });
  db.measurement.belongsTo(db.visit_detail, { foreignKey: 'visit_detail_id' });
};
