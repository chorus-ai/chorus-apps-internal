// services/omop/observation_period.js
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
 * 1) List All Observation Periods
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_period_id");
  return db.observation_period.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2) Get Observation Period by Person ID
 */
exports.findByPersonId = (personId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_period_id");
  return db.observation_period.findAll({
    where: { person_id: personId },
    order,
    offset,
    limit
  });
};

/**
 * 3) Get Observation Periods by Array of Person IDs
 */
exports.findByPersonIds = (personIds, page, pageSize, sortOrder) => {
  if (!Array.isArray(personIds) || personIds.length === 0) {
    return Promise.resolve([]);
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_period_id");
  return db.observation_period.findAll({
    where: { person_id: { [Op.in]: personIds } },
    order,
    offset,
    limit
  });
};

/**
 * 4) Advanced Search for Observation Periods
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder, "observation_period_id");
  const whereClause = {};

  for (const key of Object.keys(searchParams)) {
    const value = searchParams[key];

    if (key.endsWith("_date")) {
      const filter = buildDateFilter(value);
      if (filter) whereClause[key] = filter;
    } else if (key.endsWith("_id")) {
      const filter = buildIdFilter(value);
      if (filter !== undefined) whereClause[key] = filter;
    } else {
      const numericFilter = buildNumericFilter(value);
      if (numericFilter) whereClause[key] = numericFilter;
    }
  }

  return db.observation_period.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};

module.exports = exports;
