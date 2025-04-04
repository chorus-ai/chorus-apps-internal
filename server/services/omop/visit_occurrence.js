// services/omop/visit_occurrence.js
const db = require("../../models");
const { Op } = require("sequelize");
const { 
  getPaginationAndSort, 
  buildIdFilter, 
  buildTextFilter, 
  buildNumericFilter, 
  buildDateFilter 
} = require("./_helper");


exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  return db.visit_occurrence.findAll({
    order,
    offset,
    limit,
  });
};

exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  return db.visit_occurrence.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit,
  });
};

exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  return db.visit_occurrence.findAll({
    where: { person_id: { [Op.in]: personIds } },
    order,
    offset,
    limit,
  });
};

exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  return db.visit_occurrence.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit,
  });
};

exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  return db.visit_occurrence.findAll({
    where: { visit_occurrence_id: { [Op.in]: visitOccurrenceIds } },
    order,
    offset,
    limit,
  });
};

// ----------------- Expanded advancedSearch -----------------

exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "visit_occurrence_id");
  const whereClause = {};

  // Iterate over each search parameter key.
  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key.endsWith("_date") || key.endsWith("_datetime")) {
      // Date field filter.
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key.endsWith("_id")) {
      // ID/Concept field filter.
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else if (key.endsWith("value") || key === "source_primary_key" || key === "source_primary_key_source") {
      // Text field filter.
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    } else {
      // Fallback: treat as numeric.
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.visit_occurrence.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

module.exports = exports;
