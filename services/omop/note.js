// services/omop/note.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Notes
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Note by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Notes by array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Note by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Notes by array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.note.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Search Notes by various attributes
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    start_date,
    end_date,
    person_ids,
    visit_occurrence_ids,
    note_type_concept_ids,
    language_concept_ids,
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  // Date range
  if (start_date && end_date) {
    whereClause.note_date = { [Op.between]: [start_date, end_date] };
  } else if (start_date) {
    whereClause.note_date = { [Op.gte]: start_date };
  } else if (end_date) {
    whereClause.note_date = { [Op.lte]: end_date };
  }

  // Person IDs
  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }

  // Visit occurrence IDs
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }

  // Note type concept IDs
  if (Array.isArray(note_type_concept_ids) && note_type_concept_ids.length > 0) {
    whereClause.note_type_concept_id = { [Op.in]: note_type_concept_ids };
  }

  // Language concept IDs
  if (Array.isArray(language_concept_ids) && language_concept_ids.length > 0) {
    whereClause.language_concept_id = { [Op.in]: language_concept_ids };
  }

  return db.note.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
