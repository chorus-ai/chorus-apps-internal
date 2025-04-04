// services/omop/cohort.js
const db = require("../../models");
const { Op } = require("sequelize");
const { getPaginationAndSort } = require("./_helper");

/**
 * 1. List All Cohorts.
 *    Returns all cohort records with pagination and sorting.
 */
exports.findAll = (page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.cohort.findAll({
    order,
    offset,
    limit,
  });
};

/**
 * 2. Get All Subjects in a Cohort.
 *    Retrieves all rows for a given cohort_definition_id with pagination and sorting.
 */
exports.findByCohortDefinition = (cohortDefinitionId, page, pageSize, sortOrder) => {
  const { order, offset, limit } = getPaginationAndSort(page, pageSize, sortOrder);
  return db.cohort.findAll({
    where: { cohort_definition_id: cohortDefinitionId },
    order,
    offset,
    limit,
  });
};
