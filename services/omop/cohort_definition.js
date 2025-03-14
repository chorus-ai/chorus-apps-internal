// services/omop/cohort_definition.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Cohort Definitions
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);

  return db.cohort_definition.findAll({
    order,
    offset,
    limit
  });
};

/**
 * 2. Get Cohort Definition by ID
 */
exports.findById = (cohortDefinitionId) => {
  return db.cohort_definition.findOne({
    where: { cohort_definition_id: cohortDefinitionId }
  });
};

/**
 * 3. Text Search in Cohort Definitions
 *    Looks in both 'cohort_definition_name' and 'cohort_definition_description'
 */
exports.search = (query, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  if (!query || typeof query !== "string" || query.trim() === "") {
    return Promise.resolve([]);
  }

  const searchTerm = `%${query.trim()}%`;

  return db.cohort_definition.findAll({
    where: {
      [Op.or]: [
        { cohort_definition_name: { [Op.like]: searchTerm } },
        { cohort_definition_description: { [Op.like]: searchTerm } }
      ]
    },
    order,
    offset,
    limit
  });
};
