// services/omop/observation.js
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
 * 1. List All Observations
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  return db.observation.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Observation by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  return db.observation.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3. Get Observations by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  return db.observation.findAll({
    where: { person_id: { [Op.in]: personIds } },
    order,
    offset,
    limit
  });
};

/**
 * 4. Get Observation by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  return db.observation.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit
  });
};

/**
 * 5. Get Observations by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  return db.observation.findAll({
    where: { visit_occurrence_id: { [Op.in]: visitOccurrenceIds } },
    order,
    offset,
    limit
  });
};

/**
 * 6. Advanced Search for Observations
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];
    if (key === "observation_date" || key === "observation_datetime") {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    }
    else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    }
    else if (key.endsWith("_string") || key.endsWith("_source_value")) {
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    }
    else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.observation.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};

module.exports = exports;
