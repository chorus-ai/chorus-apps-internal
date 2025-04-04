// services/omop/measurement.js
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
 * 1. List All Measurements
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  return db.measurement.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 2. Search Concept (existing functionality)
 */
exports.search = (name, page, pageSize, exactMatch = false) => {
  if (typeof name !== "string") {
    throw new TypeError("Name must be a string");
  }
  const searchString = name.toLowerCase().trim();
  const conditions = exactMatch
    ? { [Op.eq]: searchString }
    : { [Op.like]: `%${searchString}%` };
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.concept.findAll({
    logging: console.log,
    where: { concept_name: conditions },
    offset,
    limit,
    order,
  });
};

/**
 * 3. Get Measurement by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  return db.measurement.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit,
  });
};

/**
 * 4. Get Measurements by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  return db.measurement.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit,
  });
};

/**
 * 5. Get Measurement by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (visitOccurrenceId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  return db.measurement.findAll({
    where: { visit_occurrence_id: visitOccurrenceId },
    order,
    offset,
    limit,
  });
};

/**
 * 6. Get Measurements by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (visitOccurrenceIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(visitOccurrenceIds) || visitOccurrenceIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  return db.measurement.findAll({
    where: {
      visit_occurrence_id: { [Op.in]: visitOccurrenceIds }
    },
    order,
    offset,
    limit,
  });
};

/**
 * 7. Advanced Search for Measurements
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "measurement_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key === "measurement_date" || key === "measurement_datetime" ||
        key.endsWith("_date") || key.endsWith("_datetime")) {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key === "measurement_time" || key.endsWith("source_value")) {
      const filter = buildTextFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else if (key === "value_as_number" || key === "range_low" || key === "range_high") {
      const filter = buildNumericFilter(value);
      if (filter) whereClause[key] = filter;
    } else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.measurement.findAll({
    where: whereClause,
    order,
    offset,
    limit,
  });
};

module.exports = exports;
