// services/omop/procedure_occurrence.js
const db = require("../../models");
const sequelize = require("sequelize");
const { Op } = sequelize;

const ORDERS = ["ASC", "DESC"];
const DEFAULT_SORT = [["procedure_occurrence_id", "DESC"]];
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 1000;

/**
 * Helper function for pagination & sorting
 */
function getPaginationAndSort(page, pageSize, sortOrder) {
  const pageNum = parseInt(page, 10) || 1;
  const size = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE;
  const order = ORDERS.includes((sortOrder || "").toUpperCase())
    ? [["procedure_occurrence_id", sortOrder]]
    : DEFAULT_SORT;

  const limit = size > 0 && size <= MAX_PAGE_SIZE ? size : DEFAULT_PAGE_SIZE;
  const offset = (pageNum - 1) * limit;

  return { order, offset, limit };
}

/**
 * 1. List All Procedure Occurrences
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.procedure_occurrence.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Procedure Occurrence by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.procedure_occurrence.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Procedure Occurrences by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.procedure_occurrence.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Procedure Occurrence by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.procedure_occurrence.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Procedure Occurrences by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.procedure_occurrence.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 6. Advanced Search for Procedure Occurrences
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const {
    start_procedure_date,
    end_procedure_date,
    person_ids,
    procedure_concept_ids,
    provider_ids,
    visit_occurrence_ids,
    procedure_type_concept_ids
  } = searchParams;

  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (start_procedure_date && end_procedure_date) {
    whereClause.procedure_date = {
      [Op.between]: [start_procedure_date, end_procedure_date]
    };
  } else if (start_procedure_date) {
    whereClause.procedure_date = { [Op.gte]: start_procedure_date };
  } else if (end_procedure_date) {
    whereClause.procedure_date = { [Op.lte]: end_procedure_date };
  }

  // Person IDs
  if (Array.isArray(person_ids) && person_ids.length > 0) {
    whereClause.person_id = { [Op.in]: person_ids };
  }

  // Procedure concept IDs
  if (Array.isArray(procedure_concept_ids) && procedure_concept_ids.length > 0) {
    whereClause.procedure_concept_id = { [Op.in]: procedure_concept_ids };
  }

  // Provider IDs
  if (Array.isArray(provider_ids) && provider_ids.length > 0) {
    whereClause.provider_id = { [Op.in]: provider_ids };
  }

  // Visit occurrence IDs
  if (Array.isArray(visit_occurrence_ids) && visit_occurrence_ids.length > 0) {
    whereClause.visit_occurrence_id = { [Op.in]: visit_occurrence_ids };
  }

  // Procedure type concept IDs
  if (Array.isArray(procedure_type_concept_ids) && procedure_type_concept_ids.length > 0) {
    whereClause.procedure_type_concept_id = { [Op.in]: procedure_type_concept_ids };
  }

  return db.procedure_occurrence.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
