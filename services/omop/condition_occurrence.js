// services/omop/condition_occurrence.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Condition Occurrences
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.condition_occurrence.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Condition Occurrence by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.condition_occurrence.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Condition Occurrences by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.condition_occurrence.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Condition Occurrence by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.condition_occurrence.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Condition Occurrences by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.condition_occurrence.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Advanced Search
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    start_condition_date,
    end_condition_date,
    person_ids,
    condition_concept_ids,
    provider_ids,
    visit_occurrence_ids,
    condition_type_concept_ids
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (start_condition_date && end_condition_date) {
    whereClause.condition_start_date = {
      [Op.between]: [start_condition_date, end_condition_date]
    };
  } else if (start_condition_date) {
    whereClause.condition_start_date = { [Op.gte]: start_condition_date };
  } else if (end_condition_date) {
    whereClause.condition_start_date = { [Op.lte]: end_condition_date };
  }

  // Person IDs
  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }

  // Condition concept IDs
  if (Array.isArray(condition_concept_ids) && condition_concept_ids.length > 0) {
    whereClause.condition_concept_id = { [Op.in]: condition_concept_ids };
  }

  // Provider IDs
  if (Array.isArray(provider_ids) && provider_ids.length > 0) {
    whereClause.provider_id = { [Op.in]: provider_ids };
  }

  // Visit occurrence IDs
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }

  // Condition type concept IDs
  if (Array.isArray(condition_type_concept_ids) && condition_type_concept_ids.length > 0) {
    whereClause.condition_type_concept_id = { [Op.in]: condition_type_concept_ids };
  }

  return db.condition_occurrence.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
