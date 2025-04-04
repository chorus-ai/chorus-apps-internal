// services/omop/procedure_occurrence.js
const db = require("../../models");
const { Op } = require("sequelize");
const { 
  getPaginationAndSort,
  buildIdFilter,
  buildTextFilter,
  buildNumericFilter,
  buildDateFilter
} = require("./_helper");

/**
 * 1. List All Procedure Occurrences
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  return db.procedure_occurrence.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 2. Get Procedure Occurrence by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  return db.procedure_occurrence.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit,
  });
};

/**
 * 3. Get Procedure Occurrences by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  return db.procedure_occurrence.findAll({
    where: { person_id: { [Op.in]: personIds } },
    order,
    offset,
    limit,
  });
};

/**
 * 4. Get Procedure Occurrence by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  return db.procedure_occurrence.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit,
  });
};

/**
 * 5. Get Procedure Occurrences by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  return db.procedure_occurrence.findAll({
    where: { visit_occurrence_id: { [Op.in]: visitOccurrenceIds } },
    order,
    offset,
    limit,
  });
};

/**
 * 6. Advanced Search for Procedure Occurrences
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "procedure_occurrence_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key.endsWith("_date") || key.endsWith("_datetime")) {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else if (key.endsWith("value")) {
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    } else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.procedure_occurrence.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

module.exports = exports;
