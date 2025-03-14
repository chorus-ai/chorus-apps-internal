// services/omop/observation_period.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1) List All Observation Periods
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
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
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
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
    return Promise.resolve([]); // Return an empty array if no IDs
  }
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.observation_period.findAll({
    where: {
      person_id: { [Op.in]: personIds }
    },
    order,
    offset,
    limit
  });
};

/**
 * 4) Search for Observation Periods by Date Range
 */
exports.advancedSearch = (searchParams, page, pageSize, sortOrder) => {
  const { start_date, end_date } = searchParams;
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  const whereClause = {};

  if (start_date && end_date) {
    whereClause[Op.and] = [
      { observation_period_start_date: { [Op.lte]: end_date } },
      { observation_period_end_date: { [Op.gte]: start_date } }
    ];
  } else if (start_date) {
    whereClause.observation_period_end_date = { [Op.gte]: start_date };
  } else if (end_date) {
    whereClause.observation_period_start_date = { [Op.lte]: end_date };
  }

  return db.observation_period.findAll({
    where: whereClause,
    order,
    offset,
    limit
  });
};
